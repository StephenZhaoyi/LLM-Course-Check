import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import { buildStyles } from "react-circular-progressbar";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const ApplicantDetailPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	//   TODO: Replace this mock data with actual API call
	const applicantsData = [
		{
			applicationNumber: "495090106416195",
			applicantName: "Teresa NiuB 🐮🍺",
			submissionTimestamp: new Date().toISOString(),
			nationality: "Eldia Empire",
			score: 99,
			modules: [
				{
					name: "🟦 Computer Science",
					achieved: 48,
					total: 50,
				},
				{
					name: "🟪 Theoretical Informatics",
					achieved: 6,
					total: 6,
				},
				{
					name: "🟥 Cyberphysical Systems",
					achieved: 10,
					total: 14,
				},
				{
					name: "🟨 Information Systems",
					achieved: 11,
					total: 11,
				},
				{
					name: "🟩 Mathematics",
					achieved: 30,
					total: 30,
				},
			],
		},
	];

	const applicant = applicantsData.find(
		(applicant) => applicant.applicationNumber === id
	);

	const {
		applicantName,
		submissionTimestamp,
		nationality,
		score,
		modules,
	} = applicant;

	const totalAchieved = modules.reduce(
		(sum, module) => sum + module.achieved,
		0
	);
	const totalAvailable = 111;

	if (applicant) {
		return (
			<Layout>
				<div className="flex flex-col max-h-screen bg-gray-50 mt-12 p-8">
					<div className="text-xl font-semibold text-tum-blue mb-6 border-b-[0.2rem] border-tum-blue pb-2">
						{id} - {applicantName}
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
									{new Intl.DateTimeFormat("en-US", {
										dateStyle: "medium",
									}).format(new Date(submissionTimestamp))}
								</p>
								<p className="flex flex-row">
									<p className="font-medium mr-2">
										Submission Time:
									</p>
									{new Intl.DateTimeFormat("en-US", {
										timeStyle: "short",
									}).format(new Date(submissionTimestamp))}
								</p>
								<p className="flex flex-row">
									<p className="font-medium mr-2">
										Nationality:
									</p>{" "}
									{nationality}
								</p>
								<p className="flex flex-row align-center">
									<p className="font-medium mr-2">Score:</p>
									{score}
								</p>
							</div>
						</div>

						<div className="flex flex-col items-center justify-center bg-white p-6 border-gray border-2">
							<div className="size-28">
								<CircularProgressbarWithChildren
									value={totalAchieved}
									maxValue={totalAvailable}
									styles={buildStyles({
										textSize: "14px",
										pathColor: "#3070b3",
										textColor: "#3070b3",
										trailColor: "#A1A1A1",
									})}
								>
									<div className="text-sm font-semibold">
										<span className="text-tum-blue">
											{totalAchieved}
										</span>
										/
										<span className="text-[#495D72]">
											{totalAvailable}
										</span>
									</div>

									<div className="text-xs text-[#71717A] font-medium">
										Credits
									</div>
								</CircularProgressbarWithChildren>
							</div>
							<div className="mt-4 text-center font-semibold">
								Total Credits Achieved
							</div>
						</div>
						<div className="flex flex-col bg-white p-4 border-gray border-2">
							<div className="text-md font-semibold text-tum-blue border-gray border-b-2 mb-2 pb-2">
								FILE
							</div>
							<ul>
								{/* TODO: Add links to the files */}
								<li className="mb-2">
									<a
										href="#"
										className="text-tum-blue hover:underline"
									>
										Curricular Analysis 📄
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-tum-blue hover:underline"
									>
										Modular Description 📄
									</a>
								</li>
							</ul>
						</div>
					</div>

					<div className="grid grid-cols-3 gap-6">
						{modules.map((module, index) => (
							<div
								key={index}
								className="bg-white p-4 flex flex-col items-center justify-center border-2 border-gray h-[14rem]"
							>
								<div className="size-28">
									<CircularProgressbarWithChildren
										value={module.achieved}
										maxValue={module.total}
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
											/
											<span className="text-[#495D72]">
												{module.total}
											</span>
										</div>

										<div className="text-xs text-[#71717A] font-medium">
											Credits
										</div>
									</CircularProgressbarWithChildren>
								</div>
								<p className="mt-4 text-center font-semibold">
									{module.name}
								</p>
							</div>
						))}
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
};

export default ApplicantDetailPage;
