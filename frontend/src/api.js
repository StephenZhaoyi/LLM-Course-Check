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
		const response = await axios.get(
			`${API_BASE_URL}/applicants/${applicantId}/courses`
		);
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(
			`Error fetching courses for applicant ${applicantId}:`,
			error
		);
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

export const uploadDocuments = async (applicantExcel, courseDescription) => {
	const formData = new FormData();
	formData.append("applicant_excel", applicantExcel);
	formData.append("course_description", courseDescription);

	try {
		const response = await axios.post(
			`${API_BASE_URL}/upload-documents/`,
			formData,
			{
				headers: { "Content-Type": "multipart/form-data" },
			}
		);
		return response.data;
	} catch (error) {
		console.error("File upload error:", error);
		throw error;
	}
};

export const executeCoreAnalysis = async () => {
	try {
		const response = await axios.post(`${API_BASE_URL}/execute-core`);
		return response.data;
	} catch (error) {
		console.error("Execution error:", error);
		throw error;
	}
};
