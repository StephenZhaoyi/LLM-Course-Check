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
├── 📜 App.js             # Main App component
├── 📜 index.js           # Entry point of the application
├── 📜 api.js             # API requests (Axios)
├── 📜 index.css          # Global CSS styles
├── 📜 App.css            # App-wide styles
│
├── 📂 assets/            # Static assets (logos, images)
│   └── 📜 tum-logo.svg   # TUM Logo
│
├── 📂 components/        # Reusable UI components
│   ├── 📂 Layout/        # Main layout components
│   │   ├── 📜 Layout.jsx     # Main layout wrapper
│   │   ├── 📜 Navbar.jsx     # Top navigation bar
│   │   └── 📜 Sidebar.jsx    # Sidebar menu
│   │
│   ├── 📂 Logo/          # Branding and logos
│   │   └── 📜 TUMLogo.jsx     # TUM logo component
│   │
│   ├── 📂 Modal/         # Modal components
│   │   └── 📜 ModulesDetailModal.jsx  # Modal for viewing module details
│   │
│   ├── 📂 Pagination/    # Pagination UI components
│   │   ├── 📜 Pagination.jsx          # Pagination logic
│   │   └── 📜 Pagination.stories.jsx  # Storybook for Pagination component
│
├── 📂 controllers/       # Business logic controllers (future use)
│
├── 📂 hooks/             # Custom React hooks (future use)
│
├── 📂 pages/             # Main page components
│   ├── 📜 ApplicantDetailPage.jsx     # Applicant details view
│   ├── 📜 ApplicantListPage.jsx       # Applicant list view
│   ├── 📜 ApplicantListPage.stories.jsx # Storybook for list page
│   ├── 📜 LoginPage.jsx                # Login view
│   └── 📜 mockdata.jsx                  # Mock data for testing
│
├── 📂 routes/            # React Router configuration (future use)
│
├── 📂 services/          # API services and business logic (future use)
│
├── 📂 utils/             # Utility functions/helpers (future use)
│
├── 📜 package.json       
│
├── 📜 tailwind.config.js
│
└── 📜 eslint.config.mjs

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
- **Husky** (Pre-commit hooks for code quality)
- **ESLint** (Code linting to enforce best practices)
- **Prettier** (Code formatting)

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
- Ray TANG
- TsaiChen LO

---

## 📝 License
This project is licensed under the **MIT License**.  
