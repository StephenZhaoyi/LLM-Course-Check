# Course Recognition System

This is a FastAPI-based application for managing course recognition and credit transfer processes. The system evaluates courses based on predefined criteria and provides recommendations for credit recognition.

## Database Schema

The system consists of three main entities:

### Applicant
- Personal information (name, date of birth, nationality)
- Academic background (university, subject)
- Study program details (regular duration, number of credits)

### Module
- Module identification and name
- Description of module contents

### Course
- Links to Applicant and Module
- Course details (name, credits)
- AI-assisted evaluation:
  - Generated score
  - Deduction recommendations
  - Explanatory text for decisions

## Getting Started

### Prerequisites
- Python 3.7+
- FastAPI
- SQLAlchemy
- Uvicorn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### To run

To start the FastAPI application, use the following command:

Before running the application please make sure you have .env file created and it has the values of the following two variables: OPENAI_API_KEY and DATABASE_URL.


```bash
uvicorn main:app --reload
```

## Workflow

1. **Data Loading**: The application loads evaluation data from JSON files located in the `data` directory. This includes course evaluation results and templates.

2. **API Endpoints**:
   - **Applicants**:
     - `POST /applicants/`: Create a new applicant.
     - `GET /applicants/{applicant_id}`: Retrieve applicant information by ID.
   - **Modules**:
     - `POST /modules/`: Create a new module.
     - `GET /modules/{module_id}`: Retrieve module information by ID.
   - **Courses**:
     - `POST /courses/`: Create a new course.
     - `GET /courses/{course_id}`: Retrieve course information by ID.
   - **Execute Core Logic**:
     - `POST /execute-core`: Executes the core logic defined in `core_updated.py`. This endpoint triggers the evaluation process using the OpenAI API and saves the results to a JSON file.

3. **AI Evaluation**: The system uses OpenAI's API to evaluate course similarities and generate scores and recommendations. This involves:
   - Uploading course catalogs and module handbooks.
   - Comparing applicant courses with TUM's module requirements.
   - Generating JSON output with evaluation results.

4. **Database**: The application uses SQLAlchemy to manage database interactions, with models defined for Applicants, Modules, and Courses.

5. **Environment Configuration**: Ensure that the `DATABASE_URL` and `OPENAI_API_KEY` are set in the environment or in a `.env` file for database and API access.

## Additional Information

- **Data Files**: The `data` directory contains JSON files used for course evaluation and templates.
- **Models and Schemas**: Defined in `models.py` and `schemas.py` to structure database tables and API responses.
- **Core Logic**: Implemented in `core_updated.py` for handling AI interactions and evaluations.

This README provides a comprehensive overview of the repository's structure and workflow, helping new developers understand and contribute to the project effectively.