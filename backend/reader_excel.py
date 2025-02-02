import time
import json
import re
import os

from dotenv import load_dotenv
from openai import OpenAI

def write_to_json(ai_answer):
    """Extract the applicant and course JSON blocks from ai_answer,
    then write them to the specified files.
    """
    applicant_match = re.search(r"<applicant_json>(.*?)</applicant_json>", ai_answer, re.DOTALL)
    course_match = re.search(r"<course_json>(.*?)</course_json>", ai_answer, re.DOTALL)

    if not applicant_match or not course_match:
        raise ValueError("Missing one or both JSON sections in the API response")

    try:
        applicant_json = json.loads(applicant_match.group(1).strip())
        course_json = json.loads(course_match.group(1).strip())
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON format: {e}")

    # Write the extracted JSON to files
    with open(r"read_excel_output/applicant_info.json", "w", encoding="utf-8") as applicant_file:
        json.dump(applicant_json, applicant_file, indent=4)

    with open(r"read_excel_output/converted_excel.json", "w", encoding="utf-8") as course_file:
        json.dump(course_json, course_file, indent=4)

    print("JSON content saved successfully to applicant_info.json and converted_excel.json")


def main():
    """
    Main entry point for processing the applicant Excel data using the OpenAI assistant.
    - Loads environment variables,
    - Uploads files to the OpenAI client,
    - Creates a vector store,
    - Updates the assistant,
    - Runs the thread to completion,
    - Retrieves AI's generated JSON and writes it to file.
    """
    # Load environment variables from .env file
    load_dotenv()
    
    # Initialize OpenAI client
    api_key = os.getenv("OPENAI_API_KEY")
    client = OpenAI(api_key=api_key)

    # Create file in OpenAI
    ###############################################################################################################################
    pdf_file_path = r"candidate_data/applicant_excel.pdf"
    file_upload = client.files.create(
        file=open(pdf_file_path, "rb"),
        purpose='assistants'
    )
    
    # Create vector store
    vector_store = client.beta.vector_stores.create(
        file_ids=[file_upload.id],
    )

    # Update your assistant
    assistant_id = 'asst_zwOUgbxXe9GK1bdYNRZn09rh'
    my_updated_assistant = client.beta.assistants.update(
        assistant_id=assistant_id,
        model="gpt-4o",  # Specify an available model
        instructions="You are an assistant that helps the university decide which applicants to accept.",
        tools=[{"type": "file_search"}],
        tool_resources={
            "file_search": {
                "vector_store_ids": [vector_store.id]
            }
        },
    )

    # Create a new thread
    thread = client.beta.threads.create()

    # Prepare the prompts
    applicant_template_path = r'data/applicant_info_template.json'
    with open(applicant_template_path, 'r', encoding='utf-8') as file1:
        applicant_template = file1.read()

    courses_template_path = r'data/excel_json_template.json'
    with open(courses_template_path, 'r', encoding='utf-8') as file2:
        courses_template = file2.read()

    ai_prompt =  f"""
Please use the PDF file that I provide to fill in this applicant json template {applicant_template} in all parts except applicant_id
and course json template {courses_template} in applicant's courses. The applicant's courses should contain a list of <curly bracket> "course": [course's name (in third column)], "ects": <course's ects (in 4th column, in the same row
with course's name)] <\\curly bracket>. The required information for filling in applicant json template
can be found in the first table 3rd column in the PDF (Personal data table) and the required information for filling in course json template
can be found in the second table (Curricular Analysis table). You should check carefully each row in the PDF to write
everything correctly. You should acknowledge that every course's ects can have different values, so you need
to watch out. Also, you should not make up any information to the json. If you cannot find that information in PDF, please leave it blank.
Please provide the 2 json in this format:
<applicant_json>
Filled applicant json go here
</applicant_json>

<course_json>
Filled course json go here
</course_json>
"""

    # Create a message in the thread
    message = client.beta.threads.messages.create(
        thread_id=thread.id,
        role="user",
        content=ai_prompt
    )

    # Create a run
    run = client.beta.threads.runs.create(
        thread_id=thread.id,
        assistant_id=assistant_id
    )

    # Keep polling until the run completes or fails
    while True:
        current_run = client.beta.threads.runs.retrieve(thread_id=thread.id, run_id=run.id)
        if current_run.status == "completed":
            break
        elif current_run.status == "failed":
            print("Run failed:", current_run)
            return
        time.sleep(1)  # Wait to avoid flooding the API with status requests

    # Once completed, retrieve the messages
    messages = client.beta.threads.messages.list(thread_id=thread.id)

    # The assistant's final message should contain the JSON. Print it out, then parse it.
    for msg in reversed(messages.data):
        if not msg.content:
            print(msg.role + ": (no content)")
            continue
        output_text = msg.content[0].text.value
        print(msg.role + ": " + output_text)
        
        # Attempt to parse the JSON from this message
        try:
            write_to_json(output_text)
            # If successful, we can break here
            break
        except ValueError:
            # Possibly not the correct message (e.g., a system or user message)
            continue


# If you want this script to run on its own, you can include this:
if __name__ == "__main__":
    main()
