import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

export const fetchApplicants = async () => {
	try {
		const response = await axios.get(`${API_BASE_URL}/applicants/`);
		return response.data;
	} catch (error) {
		console.error("Error fetching applicants:", error);
		return [];
	}
};

export const fetchApplicantById = async (id) => {
	try {
		const response = await axios.get(`${API_BASE_URL}/applicants/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Error fetching applicant ${id}:`, error);
		return null;
	}
};

export const fetchCoursesByApplicantId = async (applicantId) => {
	try {
		const response = await axios.get(`${API_BASE_URL}/applicants/${applicantId}/courses`);
		return response.data;
	} catch (error) {
		console.error(`Error fetching courses for applicant ${applicantId}:`, error);
		return [];
	}
};

export const fetchModules = async () => {
	try {
		const response = await axios.get(`${API_BASE_URL}/modules/`);
		return response.data;
	} catch (error) {
		console.error("Error fetching modules:", error);
		return [];
	}
};
