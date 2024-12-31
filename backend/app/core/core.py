#Bugs to be solved: there are about 5%-10% of the chance, that the assistants API cannot get the documents correctly.
import time
from openai import OpenAI

# Initialize OpenAI client
client = OpenAI(api_key="PUT API-KEY HERE")

# Upload the first file
file1 = client.files.create(
    file=open("test/permanent.pdf", "rb"),
    purpose='assistants'
)

# Upload the second file
file2 = client.files.create(
    file=open("test/CourseDescription.pdf", "rb"),
    purpose='assistants'
)

# Create a vector store containing both files
vector_store = client.beta.vector_stores.create(
    file_ids=[file1.id, file2.id],
)

# Update the assistant to enable the file_search tool and associate the vector store
my_updated_assistant = client.beta.assistants.update(
    assistant_id='asst_zwOUgbxXe9GK1bdYNRZn09rh',
    model="gpt-4o",  # Specify a model
    instructions="You are a course helper, you need to check if the course two PDFs given matched or not, you need to give the result out of 100 marks. Please use permanent PDF (file1) as the standard.",
    tools=[{"type": "file_search"}],  # Enable file_search tool
    tool_resources={
        "file_search": {
            "vector_store_ids": [vector_store.id]
        }
    },
)

# Create a thread for communication
thread = client.beta.threads.create()

# Create a user message in the thread
message = client.beta.threads.messages.create(
    thread_id=thread.id,
    role="user",
    content="Please respond if you have received any documents that I uploaded when I created this assistant API. Please use the file_search tool. If yes, please give me the comparison mark and provide the reasons. Note: if both documents are in the IT area, you must give at least 50% marks."
)

# Create a run to process the thread
run = client.beta.threads.runs.create(
    thread_id=thread.id,
    assistant_id='asst_zwOUgbxXe9GK1bdYNRZn09rh'
)

# Retrieve the run status
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
    time.sleep(1)  # Wait for 1 second to avoid overwhelming the server

# Once completed, retrieve the messages
messages = client.beta.threads.messages.list(thread_id=thread.id)

# Print all messages in the thread
for msg in reversed(messages.data):
    if not msg.content:
        print(msg.role + ": (no content)")
        continue
    print(msg.role + ": " + msg.content[0].text.value)
