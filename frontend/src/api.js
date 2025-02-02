import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
		return response.data;
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
	if (applicantExcel) formData.append("applicant_excel", applicantExcel);
	if (courseDescription)
		formData.append("course_description", courseDescription);

	try {
		// toast.info("Uploading documents...", { autoClose: 2000 });
		const response = await axios.post(
			`${API_BASE_URL}/upload-documents/`,
			formData,
			{
				headers: { "Content-Type": "multipart/form-data" },
			}
		);
		// toast.success("Documents uploaded successfully!", { autoClose: 3000 });
		return response.data;
	} catch (error) {
		console.error("File upload error:", error.response?.data || error);
		toast.error("File upload failed! Please try again.", { autoClose: 4000 });
		throw error;
	}
};

export const executeCoreAnalysis = async (applicantId) => {
    try {
        toast.info(`Executing core analysis for applicant ${applicantId}...`, { autoClose: 3000 });

        // console.log(`Executing core analysis for applicant ${applicantId}`);
        const response = await axios.post(
            `${API_BASE_URL}/execute-core/${applicantId}`
        );

        toast.success("Core analysis completed successfully!", { autoClose: 3000 });
        return response.data;
    } catch (error) {
        console.error(`Execution error for applicant ${applicantId}:`, error.response?.data || error.message);
        toast.error("Core analysis failed. Please check the logs.", { autoClose: 4000 });
        throw error;
    }
};

export const updateApplicantScore = async (applicantId, newScore) => {
	try {
		const response = await axios.put(
			`${API_BASE_URL}/applicants/${applicantId}/update-score`,
			null,
			{ params: { score: newScore } }
		);
		return response.data;
	} catch (error) {
		console.error(`Error updating score for applicant ${applicantId}:`, error.response?.data || error.message);
		throw error;
	}
};
