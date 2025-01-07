import React from "react";
import ApplicantListPage from "./pages/ApplicantListPage";
import ApplicantDetailPage from "./pages/ApplicantDetailPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Layout/Navbar";
import { NavLink } from "react-router-dom";
import Sidebar from "./components/Layout/Sidebar";

// this is the temporary landing page for the app
function App() {
	return (
		<Router>
			<Navbar />
			<Sidebar />
			<Routes>
				<Route
					path="/"
					element={
						<div>
							<div className="text-center mt-24">
								<h1 className="text-3xl font-semibold mb-6 text-tum-blue">
									Ray, 我要 shamepoo
								</h1>
								<NavLink
									to="/applicants"
									className="bg-tum-blue text-white px-4 py-2 rounded hover:bg-blue-700 transition"
								>
									Go to Applicant List Page
								</NavLink>
							</div>
						</div>
					}
				/>
				<Route path="/applicants" element={<ApplicantListPage />} />
				<Route path="/applicant/:id" element={<ApplicantDetailPage />} />
			</Routes>
		</Router>
	);
}

export default App;
