# 📘 TUM Course Analyser Frontend

This is the **frontend** for the **Credit Recognition System**, which helps in evaluating student courses and mapping them to relevant modules for application.

## 🚀 Features
- View **applicants** and their **course evaluations**
- Upload **Curricular Analysis** and **Modular Description** PDFs
- Execute **Core Analysis** to process and update applicant scores
- Interactive **module visualization** with detailed course mapping
- Uses **React Router** for navigation and **Toastify** for notifications

---

## 🏗️ Project Setup

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/StephenZhaoyi/LLM-Course-Check.git
cd frontend
```

### **2️⃣ Install Dependencies**
```sh
yarn install
```

### **3️⃣ Start the Application**
```sh
yarn start
```
This will start the frontend on `http://localhost:3000/`.

---

## 🛠️ API Integration
The frontend interacts with a **FastAPI backend** to fetch and update applicant and course data.

### **API Endpoints Used**
| Method | Endpoint | Description |
|--------|---------|-------------|
| `GET` | `/applicants/` | Fetch all applicants |
| `GET` | `/applicants/{id}` | Fetch applicant details |
| `GET` | `/applicants/{id}/courses` | Fetch courses for an applicant |
| `POST` | `/upload-documents/` | Upload applicant PDFs |
| `POST` | `/execute-core/{id}` | Execute course evaluation |
| `POST` | `/update-applicant-score/{id}` | Update applicant score |

---

## 📂 Project Structure
```
📂 src/
 ┣ 📜 api.js              # API requests (Axios)
 ┣ 📂 components/        # Reusable UI components
 ┣ 📂 pages/             # Main pages (ApplicantList, ApplicantDetail)
 ┣ 📜 App.js             # Main App component
 ┣ 📜 index.js           # Entry point
 ┗ 📜 routes.js          # React Router configuration
```

---

## 📌 Key Features Explained

### **1️⃣ Applicant List**
- Displays a table of **all applicants**
- Click on an applicant to **view detailed evaluation**

### **2️⃣ Applicant Detail Page**
- Shows **applicant info** (university, subject, etc.)
- Displays **module-wise course evaluations**
- **Run Analysis** button to **recalculate scores**
- Uses **Toastify** for success/error messages

### **3️⃣ File Upload & Analysis Execution**
- Allows users to **upload PDFs**
- Runs **OpenAI-based course evaluation** via backend
- Updates **applicant scores immediately after execution**

---

## 🎨 Technologies Used
- **React.js** (Component-based UI)
- **Tailwind CSS** (Styling)
- **React Router** (Navigation)
- **Axios** (API calls)
- **React Toastify** (Notifications)
- **Circular Progress Bar** (Score visualization)

---

## 🐞 Troubleshooting

### 🔴 **API Not Responding?**
- Ensure the **FastAPI backend** is running on `http://127.0.0.1:8000`
- Check if `.env` has the correct API URL

### 🔴 **File Upload Not Working?**
- Ensure files are **PDF format**
- Check backend logs (`yarn start` for frontend, `uvicorn main:app --reload` for backend)

### 🔴 **Score Not Updating Immediately?**
- Try refreshing the page after running analysis
- Check if `updateApplicantScore()` is called after `executeCoreAnalysis()`

---

## 👨‍💻 Contributors
- 

---

## 📝 License
This project is licensed under the **MIT License**.  