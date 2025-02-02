import React, { useState, useEffect } from "react";
import { MdOutlineUploadFile } from "react-icons/md";
import { AiOutlineCheck } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import ModulesWithDetails from "../components/Modal/ModulesDetailModal";
import { buildStyles } from "react-circular-progressbar";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
	fetchApplicantById,
	fetchCoursesByApplicantId,
	uploadDocuments,
	executeCoreAnalysis,
} from "../api";
// import mockData from "./mockdata";

const modules = [
	{ id: 1, name: "🟦 Informatics", totalCredits: 50 },
	{ id: 2, name: "🟪 Theoretical Informatics", totalCredits: 6 },
	{ id: 3, name: "🟥 Cyberphysical Systems", totalCredits: 14 },
	{ id: 4, name: "🟨 Information Systems", totalCredits: 11 },
	{ id: 5, name: "🟩 Mathematics", totalCredits: 30 },
];

const ApplicantDetailPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [applicant, setApplicant] = useState(null);
	const [courses, setCourses] = useState([]);

	useEffect(() => {
		const loadApplicantData = async () => {
			try {
				const applicantData = await fetchApplicantById(id);
				setApplicant(applicantData);
			} catch (error) {
				console.error("Error fetching applicant:", error);
			}
		};
		const loadCourses = async () => {
			try {
				const coursesData = await fetchCoursesByApplicantId(id);
				if (!coursesData || coursesData.length === 0) {
					console.warn("No courses found for this applicant.");
				}
				console.log(
					"Fetched courses:",
					JSON.stringify(coursesData, null, 2)
				);
				setCourses(coursesData);
			} catch (error) {
				console.error("Error fetching courses:", error);
			}
		};
		loadApplicantData();
		loadCourses();
	}, [id]);

	const [fileUploadStatus, setFileUploadStatus] = useState({
		applicantExcel: false,
		courseDescription: false,
	});
	const [isUploading, setIsUploading] = useState(false);
	const [isExecuting, setIsExecuting] = useState(false);
	const handleFileUpload = async (e, fileType) => {
		const file = e.target.files[0];
		if (!file) return;

		setIsUploading(true);
		try {
			console.log(`Uploading ${fileType}:`, file.name);

			const applicantExcel = fileType === "applicantExcel" ? file : null;
			const courseDescription =
				fileType === "courseDescription" ? file : null;

			await uploadDocuments(applicantExcel, courseDescription);
			console.log("File uploaded successfully!");

			setFileUploadStatus((prevStatus) => ({
				...prevStatus,
				[fileType]: true,
			}));
		} catch (error) {
			console.error("File upload failed:", error);
		} finally {
			setIsUploading(false);
		}
	};

	const handleExecuteCore = async () => {
		setIsExecuting(true);
		try {
			console.log("Running core analysis...");
			await executeCoreAnalysis();
			console.log("Analysis completed successfully!");
			alert("Analysis completed successfully!");
		} catch (error) {
			console.error("Analysis failed:", error);
			alert("Analysis failed!");
		} finally {
			setIsExecuting(false);
		}
	};

	// test data
	console.log("applicant", applicant);
	console.log("courses", courses);
	const TOTAL_CREDITS = 111;

	if (!applicant) {
		return (
			<Layout>
				<div className="flex flex-col max-h-screen bg-gray-50 mt-12 p-8">
					<div className="text-xl font-semibold text-red-500">
						Applicant not found!
					</div>
					<button
						onClick={() => navigate(-1)}
						className="mt-6 px-4 py-2 bg-tum-blue text-white rounded hover:bg-blue-700 transition"
					>
						Go Back
					</button>
				</div>
			</Layout>
		);
	}

	// Map modules to include achieved and total credits based on courses
	const modulesWithAchievedCredits = modules.map((module) => {
		const moduleCourses = courses.filter(
			(course) => course.module_id === module.id
		);

		const achievedCredits = moduleCourses.reduce(
			(sum, course) => sum + (course.achieved_credits || 0),
			0
		);

		const totalScore = moduleCourses.reduce(
			(sum, course) => sum + (course.score || 0),
			0
		);

		return { ...module, achieved: achievedCredits, score: totalScore };
	});

	const totalAchievedCredits = modulesWithAchievedCredits.reduce(
		(sum, module) => sum + module.score,
		0
	);

	const [selectedModule, setSelectedModule] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleOpenModal = (module) => {
		console.log("Opening modal for module:", module);
		setSelectedModule({
			...module,
			courses: courses.filter((course) => course.moduleId === module.id),
		});
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		console.log("Closing modal");
		setIsModalOpen(false);
		setSelectedModule(null);
	};

	if (applicant) {
		return (
			<Layout>
				<div className="flex flex-col max-h-screen bg-gray-50 mt-12 p-8">
					<div className="text-xl font-semibold text-tum-blue mb-6 border-b-[0.2rem] border-tum-blue pb-2">
						{id} - {applicant?.first_name} {applicant?.last_name}
					</div>

					<div className="grid grid-cols-3 gap-6 mb-6 bg-[#EEEEEE] p-6 h-[16rem]">
						<div className="flex flex-col bg-white p-4 border-gray border-2">
							<div className="text-md font-semibold text-tum-blue border-gray border-b-2 mb-2 pb-2">
								STUDENT INFORMATION
							</div>
							<div className="grid gap-y-3">
								<p className="flex flex-row">
									<p className="font-medium mr-2">
										Date of Birth
									</p>
									{applicant.applicantDateOfBirth}
								</p>
								<p className="flex flex-row">
									<p className="font-medium mr-2">
										Submission Time:
									</p>
									{applicant.submissionTime}
								</p>
								<p className="flex flex-row">
									<p className="font-medium mr-2">
										Nationality:
									</p>{" "}
									{applicant.nationality}
								</p>
								<p className="flex flex-row align-center">
									<p className="font-medium mr-2">Score:</p>
									{totalAchievedCredits}
								</p>
							</div>
						</div>

						<div className="flex flex-col items-center justify-center bg-white p-6 border-gray border-2">
							<div className="size-28">
								<CircularProgressbarWithChildren
									value={totalAchievedCredits}
									maxValue={TOTAL_CREDITS}
									styles={buildStyles({
										textSize: "14px",
										pathColor: "#3070b3",
										textColor: "#3070b3",
										trailColor: "#A1A1A1",
									})}
								>
									<div className="text-sm font-semibold">
										<span className="text-tum-blue">
											{totalAchievedCredits}
										</span>
										<span className="mx-1">/</span>
										<span className="text-[#495D72]">
											{TOTAL_CREDITS}
										</span>
									</div>

									<div className="text-xs text-[#71717A] font-medium">
										Credits
									</div>
								</CircularProgressbarWithChildren>
							</div>
							<div className="mt-4 text-center font-semibold">
								Total Scores
							</div>
						</div>
						<div className="flex flex-col bg-white p-4 border-gray border-2">
							<div className="text-md font-semibold text-tum-blue border-gray border-b-2 mb-2 pb-2">
								FILE
							</div>
							<div className="flex flex-col space-y-4">
								<div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg border border-gray-300">
									<label
										htmlFor="applicantExcel"
										className="text-tum-blue flex items-center cursor-pointer"
									>
										<p className="mr-3 font-medium">
											Curricular Analysis
										</p>
										<MdOutlineUploadFile className="text-xl hover:scale-110 transition-transform" />
									</label>
									{fileUploadStatus.applicantExcel && (
										<AiOutlineCheck className="text-green-500 text-xl" />
									)}
									<input
										id="applicantExcel"
										type="file"
										accept="application/pdf"
										className="hidden"
										onChange={(e) =>
											handleFileUpload(
												e,
												"applicantExcel"
											)
										}
									/>
									{isUploading && (
										<span className="text-tum-blue font-semibold">
											Uploading...
										</span>
									)}
								</div>
								\{" "}
								<div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg border border-gray-300">
									<label
										htmlFor="courseDescription"
										className="text-tum-blue flex items-center cursor-pointer"
									>
										<p className="mr-3 font-medium">
											Modular Description
										</p>
										<MdOutlineUploadFile className="text-xl hover:scale-110 transition-transform" />
									</label>
									{fileUploadStatus.courseDescription && (
										<AiOutlineCheck className="text-green-500 text-xl" />
									)}
									<input
										id="courseDescription"
										type="file"
										accept="application/pdf"
										className="hidden"
										onChange={(e) =>
											handleFileUpload(
												e,
												"courseDescription"
											)
										}
									/>
									{isUploading && (
										<span className="text-tum-blue font-semibold">
											Uploading...
										</span>
									)}
								</div>
							</div>

							<button
								onClick={handleExecuteCore}
								className={`mt-4 px-4 py-2 rounded text-white font-semibold ${
									isExecuting
										? "bg-gray-400 cursor-not-allowed"
										: "bg-tum-blue hover:bg-blue-700"
								}`}
								disabled={isExecuting}
							>
								{isExecuting
									? "Running Analysis..."
									: "Run Analysis"}
							</button>
						</div>
					</div>

					<div className="grid grid-cols-3 gap-6">
						{modulesWithAchievedCredits.map((module, index) => (
							<div
								key={index}
								className="bg-white p-4 flex flex-col items-center justify-center border-2 border-gray h-[14rem] cursor-pointer hover:border-tum-blue/70 transition-all"
								onClick={() => handleOpenModal(module)}
							>
								<div className="size-28">
									<CircularProgressbarWithChildren
										value={module.achieved}
										maxValue={module.totalCredits}
										styles={buildStyles({
											textSize: "14px",
											pathColor: "#3070b3",
											textColor: "#3070b3",
											trailColor: "#A1A1A1",
										})}
									>
										<div className="text-sm font-semibold">
											<span className="text-tum-blue">
												{module.achieved}
											</span>
											<span className="mx-1">/</span>
											<span className="text-[#495D72]">
												{module.totalCredits}
											</span>
										</div>

										<div className="text-xs text-[#71717A] font-medium">
											Scores
										</div>
									</CircularProgressbarWithChildren>
								</div>
								<p className="mt-4 text-center font-semibold">
									{module.name}
								</p>
							</div>
						))}
					</div>
					{selectedModule && (
						<ModulesWithDetails
							isOpen={isModalOpen}
							onClose={handleCloseModal}
							module={selectedModule}
						/>
					)}
					<button
						onClick={() => navigate(-1)}
						className="mt-6 px-4 py-2 bg-tum-blue text-white rounded hover:bg-blue-700 transition"
					>
						Go Back
					</button>
				</div>
			</Layout>
		);
	}
};

export default ApplicantDetailPage;
