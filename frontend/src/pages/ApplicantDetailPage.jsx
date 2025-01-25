import React, { useState } from "react";
import { MdOutlineUploadFile } from "react-icons/md";
import { AiOutlineCheck } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import ModulesWithDetails from "../components/Modal/ModulesDetailModal";
import { buildStyles } from "react-circular-progressbar";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import mockData from "./mockdata";

const ApplicantDetailPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const modules = [
		{ id: 1, name: "🟦 Informatics", totalCredits: 50 },
		{ id: 2, name: "🟪 Theoretical Informatics", totalCredits: 6 },
		{ id: 3, name: "🟥 Cyberphysical Systems", totalCredits: 14 },
		{ id: 4, name: "🟨 Information Systems", totalCredits: 11 },
		{ id: 5, name: "🟩 Mathematics", totalCredits: 30 },
	];

	const TOTAL_CREDITS = 111;

	const applicant = mockData.applicants.find(
		(applicant) => applicant.applicantId.toString() === id
	);

	const courses = mockData.courses.filter(
		(course) => course.applicantId.toString() === id
	);

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

	const {
		firstName,
		lastName,
		nationality,
		submissionDate,
		submissionTime,
	} = applicant;

	// Map modules to include achieved and total credits based on courses
	const modulesWithAchievedCredits = modules.map((module) => {
		const moduleCourses = Array.isArray(courses)
			? courses.filter((course) => course.moduleId === module.id)
			: [];

		const achievedCredits = moduleCourses.reduce(
			(sum, course) => sum + (course.achievedCredits || 0),
			0
		);

		return { ...module, achieved: achievedCredits };
	});

	const totalAchievedCredits = modulesWithAchievedCredits.reduce(
		(sum, module) => sum + module.achieved,
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

	const [fileUploadStatus, setFileUploadStatus] = useState({
		curricularAnalysis: false,
		modularDescription: false,
	});

	const handleFileUpload = (e, fileType) => {
		const file = e.target.files[0];
		if (file) {
			console.log(`Uploaded ${fileType}:`, file.name);
			setFileUploadStatus((prevStatus) => ({
				...prevStatus,
				[fileType]: true,
			}));
		}
	};

	if (applicant) {
		return (
			<Layout>
				<div className="flex flex-col max-h-screen bg-gray-50 mt-12 p-8">
					<div className="text-xl font-semibold text-tum-blue mb-6 border-b-[0.2rem] border-tum-blue pb-2">
						{id} - {firstName} {lastName}
					</div>

					<div className="grid grid-cols-3 gap-6 mb-6 bg-[#EEEEEE] p-6 h-[16rem]">
						<div className="flex flex-col bg-white p-4 border-gray border-2">
							<div className="text-md font-semibold text-tum-blue border-gray border-b-2 mb-2 pb-2">
								STUDENT INFORMATION
							</div>
							<div className="grid gap-y-3">
								<p className="flex flex-row">
									<p className="font-medium mr-2">
										Submission Date:
									</p>
									{submissionDate}
								</p>
								<p className="flex flex-row">
									<p className="font-medium mr-2">
										Submission Time:
									</p>
									{submissionTime}
								</p>
								<p className="flex flex-row">
									<p className="font-medium mr-2">
										Nationality:
									</p>{" "}
									{nationality}
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
							<ul>
								<li className="mb-2">
									<label
										htmlFor="curricularAnalysis"
										className="text-tum-blue flex items-center"
									>
										<p>Curricular Analysis</p>
										<span className="ml-2 hover:cursor-pointer">
											<MdOutlineUploadFile />
										</span>
										{fileUploadStatus.curricularAnalysis && (
											<span className="ml-2 text-green-500">
												<AiOutlineCheck />
											</span>
										)}
									</label>
									<input
										id="curricularAnalysis"
										type="file"
										accept="application/pdf"
										className="hidden"
										onChange={(e) =>
											handleFileUpload(
												e,
												"curricularAnalysis"
											)
										}
									/>
								</li>
								<li>
									<label
										htmlFor="modularDescription"
										className="text-tum-blue flex items-center"
									>
										<p>Modular Description</p>
										<span className="ml-2 hover:cursor-pointer">
											<MdOutlineUploadFile />
										</span>
										{fileUploadStatus.modularDescription && (
											<span className="ml-2 text-green-500">
												<AiOutlineCheck />
											</span>
										)}
									</label>
									<input
										id="modularDescription"
										type="file"
										accept="application/pdf"
										className="hidden"
										onChange={(e) => handleFileUpload(e, "modularDescription")}
									/>
								</li>
							</ul>
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
