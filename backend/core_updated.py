import os
import time
import json
import re

from dotenv import load_dotenv
from openai import OpenAI


def write_to_json(ai_answer, output_file):
    """
    Extract the JSON content (between <json> and </json>) from the AI's response
    and write it to the specified output file in JSON format.
    """
    match = re.search(r"<json>(.*?)</json>", ai_answer, re.DOTALL)
    if match:
        json_content = match.group(1).strip()
    else:
        raise ValueError("No JSON content found in the API response")
    
    try:
        data = json.loads(json_content)
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON format: {e}")
    
    with open(output_file, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=4)
    print(f"JSON content saved successfully to {output_file}")


def main():
    """
    Main entry point:
      1. Loads environment variables.
      2. Initializes OpenAI client.
      3. Uploads a PDF for vector store creation.
      4. Reads local JSON templates.
      5. Updates an existing assistant with instructions and files.
      6. Creates a thread, prompts GPT, and polls until the run completes.
      7. Retrieves the AI response, prints it, and writes the JSON to a file.
    """
    # Load environment variables from .env file
    load_dotenv()

    # Get the API key from environment variables
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("API key not found. Please add it to the .env file.")
    
    # Initialize OpenAI client
    client = OpenAI(api_key=api_key)

    # Upload the PDF file
    ###############################################################################################################################
    pdf_file_path = r"candidate_data/course_description.pdf"
    file_upload = client.files.create(
        file=open(pdf_file_path, "rb"),
        purpose="assistants"
    )

    # Create a vector store
    vector_store = client.beta.vector_stores.create(
        file_ids=[file_upload.id],
    )

    # Read local JSON templates
    ###############################################################################################################################
    json_path_excel = r"read_excel_output/converted_excel.json"
    with open(json_path_excel, "r", encoding="utf-8") as f_excel:
        json_text_excel = f_excel.read()

    ###############################################################################################################################
    json_path_evaluation = r"data/evaluation_template.json"
    with open(json_path_evaluation, "r", encoding="utf-8") as f_eval:
        json_text_evaluation = f_eval.read()

    ###############################################################################################################################
    json_path_tum = r"data/tum_module.json"
    with open(json_path_tum, "r", encoding="utf-8") as f_tum:
        json_text_tum = f_tum.read()

    # Define the assistant's instructions
    ai_instruction = (
        "You are acting with a course examiner, you will need to give results according to a PDF."
    )

    # Update your assistant
    assistant_id = "asst_zwOUgbxXe9GK1bdYNRZn09rh"
    my_updated_assistant = client.beta.assistants.update(
        assistant_id=assistant_id,
        model="gpt-4o",
        instructions=ai_instruction,
        tools=[{"type": "file_search"}],
        tool_resources={
            "file_search": {
                "vector_store_ids": [vector_store.id]
            }
        },
    )

    # Create a new thread
    thread = client.beta.threads.create()

    # Prepare the prompt
    prompt = f"""
    Please use the JSON_EXCEL {json_text_excel} I provided, and the students' module handbook I uploaded as the PDF, 
    and the give the similarity in the marks parts of Json. Please use following grading criteria:
    Case 1: Applicant ect < TUM ects
        deduction_recommendation = TUM_course_ect - (Similarity percentage * TUM_course_ect * Applicant_ect / TUM ects)

    Case 2: Applicant ect >= TUM ects
        deduction_recommendation = TUM_course_ect - Similarity percentage * TUM_course_ect
    To compare the similarity, you should compare the TUM's module handbook with JSON_HANDBOOK {json_text_tum} and the 
    uploaded PDF.
    For the output, please use JSON_Evaluation {json_text_evaluation} as the template.
    In the JSON_Evaluation in explanation_recommendation part, you will give reasons why the course's mark is deduced 
    following this template:
    - If you decide to not deduce anything:
    "The applicant's course covers [list of competencies that TUM's course and applicant's course match]"
    - If you decide to reduce the point:
    "The applicant's course lack [list of competencies that TUM's course that applicant's course lack]"
    You should not add non natural language (such as course code) inside the 
    explanation_recommendation.
    You should write json file inside this box:
    <json>
    JSON here
    </json>.
    You should not add any other information in this json, because I will need machine to read your output directly
    """

    # Create a message in the thread
    message = client.beta.threads.messages.create(
        thread_id=thread.id,
        role="user",
        content=prompt
    )

    # Create a run
    run = client.beta.threads.runs.create(
        thread_id=thread.id,
        assistant_id=assistant_id
    )

    # Poll the run for completion
    while True:
        current_run = client.beta.threads.runs.retrieve(
            thread_id=thread.id,
            run_id=run.id
        )
        if current_run.status == "completed":
            break
        elif current_run.status == "failed":
            print("Run failed:", current_run)
            return  # or raise an exception, depending on your needs
        time.sleep(1)  # avoid spamming the API

    # Retrieve messages
    messages = client.beta.threads.messages.list(thread_id=thread.id)

    # Display the last assistant message and then parse out the JSON
    output_file = r"data1/evaluation_result.json"
    for msg in reversed(messages.data):
        if not msg.content:
            print(msg.role + ": (no content)")
            continue

        # Print the AI's content
        ai_answer = msg.content[0].text.value
        print(msg.role + ": " + ai_answer)

        # Attempt to parse/write JSON
        try:
            write_to_json(ai_answer, output_file)
            # If successful, we can break out of the loop
            break
        except ValueError:
            # Possibly not the right message or no JSON yet
            continue


if __name__ == "__main__":
    main()
