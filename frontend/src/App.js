import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ApplicantListPage from "./pages/ApplicantListPage";
import ApplicantDetailPage from "./pages/ApplicantDetailPage";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default page: LoginPage */}
        <Route path="/" element={<LoginPage />} />
        {/* Navigate to Applicants page after successful login */}
        <Route path="/applicants" element={<ApplicantListPage />} />
        <Route path="/applicant/:id" element={<ApplicantDetailPage />} />
        {/* Handle unmatched routes, redirect to LoginPage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
