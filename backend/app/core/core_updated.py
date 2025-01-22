import time
from openai import OpenAI
import json
import re
from dotenv import load_dotenv
import os

# Initialize OpenAI client
load_dotenv("APIKey.env")
api_key_1 = os.getenv("API_KEY")
client = OpenAI(api_key=api_key_1)

file2 = client.files.create(
    file = open(r"backend\app\data\example_1_course_catalogue_LMU_BSc_Informatics.pdf","rb"),
    purpose = 'assistants'
)

vector_store = client.beta.vector_stores.create(
    file_ids = [file2.id],
)

# Path to your JSON file
json_path_excel = r'backend\app\data\applicant_excel.json'
with open(json_path_excel, 'r', encoding='utf-8') as file1:
    json_text_excel = file1.read()
json_path_evaluation = r'backend\app\data\evaluation_template.json'
with open(json_path_evaluation, 'r', encoding='utf-8') as file2:
    json_text_evaluation = file2.read()
json_path_tum = r'backend\app\data\tum_module.json'
with open(json_path_tum, 'r', encoding='utf-8') as file3:
    json_text_tum = file3.read()

ai_instruction = "You are acting with a course examiner, you wil need to give results according to a PDF."

my_updated_assistant = client.beta.assistants.update(
    assistant_id='asst_zwOUgbxXe9GK1bdYNRZn09rh',
    model="gpt-4o", #gpt-4o",                     # Specify an available model
    instructions=ai_instruction,
    tools=[{"type": "file_search"}],   # Declare the use of file_search
    tool_resources={
        "file_search": {
            "vector_store_ids": [vector_store.id]
        }
    },
)

# Create a thread
thread = client.beta.threads.create()

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


# Create a message
message = client.beta.threads.messages.create(
    thread_id=thread.id,
    role="user",
    content=prompt
)

# Create run
run = client.beta.threads.runs.create(
    thread_id=thread.id,
    assistant_id='asst_zwOUgbxXe9GK1bdYNRZn09rh'
)

# Display
run = client.beta.threads.runs.retrieve(
    thread_id=thread.id,
    run_id=run.id
)

messages = client.beta.threads.messages.list(
    thread_id=thread.id
)

# Keep polling run.status until it becomes "completed"
while True:
    current_run = client.beta.threads.runs.retrieve(
        thread_id=thread.id,
        run_id=run.id
    )
    if current_run.status == "completed":
        break
    elif current_run.status == "failed":
        print("Run failed:", current_run)
        break
    time.sleep(1)  # Wait for 1 second to avoid frequent polling

# Once completed, retrieve the messages
messages = client.beta.threads.messages.list(thread_id=thread.id)

for msg in reversed(messages.data):
    if not msg.content:
        print(msg.role + ": (no content)")
        continue
    print(msg.role + ": " + msg.content[0].text.value)

def write_to_json(ai_answer):
    match = re.search(r"<json>(.*?)</json>", ai_answer, re.DOTALL)
    if match:
        json_content = match.group(1).strip()
    else:
        raise ValueError("No JSON content found in the API response")
    
    try:
        data = json.loads(json_content)
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON format: {e}")
    
    output_file = r"backend\app\data\evaluation_result.json"
    with open(output_file, "w") as file:
        json.dump(data, file, indent=4)
    print(f"JSON content saved successfully to {output_file}")
write_to_json(msg.content[0].text.value)