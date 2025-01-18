import time
from openai import OpenAI
import json
import re

# assistant_id: asst_fFyYyvEq8Tf7jknT7W0UGTYH
# Initialize OpenAI client
client = OpenAI(api_key="API-KEY HERE")
file1 = client.files.create(
    file=open(r"backend\app\data\example_1_application_sheet.pdf", "rb"),
    purpose='assistants'
)
vector_store = client.beta.vector_stores.create(
    file_ids=[file1.id],
)
my_updated_assistant = client.beta.assistants.update(
    assistant_id='asst_zwOUgbxXe9GK1bdYNRZn09rh',
    model="gpt-4o",                     # Specify an available model
    instructions="You are an assistant that help the university decides which applicants to accept to a Master program",
    tools=[{"type": "file_search"}],   # Declare the use of file_search
    tool_resources={
        "file_search": {
            "vector_store_ids": [vector_store.id]
        }
    },
)

# Create a thread
thread = client.beta.threads.create()
# Create a message
# Prepare the json format for the first table (Personal data of applicant)
applicant_template_path = r'backend\app\data\applicant_info_template.json'
with open(applicant_template_path, 'r', encoding='utf-8') as file1:
    applicant_template = file1.read()

# Prepare the json format for the second table (Curriculum Analysis)
courses_template_path = r'backend\app\data\excel_json_template.json'
with open(courses_template_path, 'r', encoding='utf-8') as file2:
    courses_template = file2.read()
ai_prompt =  f"""
Please use the PDF file that I provide to fill in this applicant json template {applicant_template} in all parts except applicant_id
and course json template {courses_template} in applicant's courses. The applicant's courses should contain a list of <curly bracket> "course": [course's name (in third column)], "ects": <course's ects (in 4th column, in the same row
with course's name)] <\curly bracket>. The required information for filling in applicant json template
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

message = client.beta.threads.messages.create(
    thread_id=thread.id,
    role="user",
    content=ai_prompt
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
    applicant_match = re.search(r"<applicant_json>(.*?)</applicant_json>", ai_answer, re.DOTALL)
    course_match = re.search(r"<course_json>(.*?)</course_json>", ai_answer, re.DOTALL)

    if not applicant_match or not course_match:
        raise ValueError("Missing one or both JSON sections in the API response")

    try:
        applicant_json = json.loads(applicant_match.group(1).strip())
        course_json = json.loads(course_match.group(1).strip())
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON format: {e}")

    with open(r"backend\app\data\applicant_info.json", "w") as applicant_file:
        json.dump(applicant_json, applicant_file, indent=4)

    with open(r"backend\app\data\converted_excel.json", "w") as course_file:
        json.dump(course_json, course_file, indent=4)

    print("JSON content saved successfully to applicant.json and course.json")
write_to_json(msg.content[0].text.value)