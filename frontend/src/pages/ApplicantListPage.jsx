import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { match } from "ts-pattern";
import { HiOutlineDotsVertical } from "react-icons/hi";
import Pagination from "../components/Pagination/Pagination";
import { Link } from "react-router-dom";
import { fetchApplicants } from "../api";

export default function ApplicantListPage() {
	const itemsPerPage = 15;
	const [currentPage, setCurrentPage] = useState(1);
	const [applicants, setApplicants] = useState([]);

	useEffect(() => {
		const loadApplicants = async () => {
			try {
				const data = await fetchApplicants();
	
				// Transform API data to match the expected structure
				const formattedApplicants = data.map((applicant) => ({
					applicationNumber: applicant.applicant_id,
					applicantName: `${applicant.first_name} ${applicant.last_name}`,
					submissionTime: "2024-01-01 09:00:00",
					applicantDateOfBirth: applicant.date_of_birth,
					nationality: applicant.nationality,
					score: applicant.score,
				}));
	
				console.log("Formatted applicants:", formattedApplicants);
				setApplicants(formattedApplicants);
			} catch (error) {
				console.error("Error fetching applicants:", error);
			}
		};
	
		loadApplicants();
	}, []);

	const sortedApplicants = [...applicants].sort((a, b) => b.score - a.score);

	const totalPages = Math.ceil(sortedApplicants.length / itemsPerPage);
	const currentApplicants = sortedApplicants.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	// ts-pattern to match score ranges
	const getScoreStyles = (score) => {
		return match(score)
			.when(
				(s) => s >= 80,
				() => ({
					textColor: "text-[#61A249]",
					bgColor: "bg-[#D9EED1]",
				})
			)
			.when(
				(s) => s > 50 && s < 80,
				() => ({
					textColor: "text-[#406978]",
					bgColor: "bg-[#CBE6F0]",
				})
			)
			.otherwise(() => ({
				textColor: "text-[#805C5C]",
				bgColor: "bg-[#F0CBCB]",
			}));
	};

	return (
		<Layout>
			<div className="flex flex-col max-h-screen bg-gray-50 mt-12 p-8">
				<div className="text-xl font-semibold text-tum-blue mb-6 border-b-[0.2rem] border-tum-blue pb-2">
					Applicant List
				</div>

				<div className="bg-white rounded-lg overflow-hidden">
					<div className="grid grid-cols-[1fr_1.5fr_1.2fr_1.3fr_1.2fr_0.8fr_0.4fr] gap-4 bg-gray-100 text-title-gray font-semibold uppercase text-sm px-2 py-3">
						<div className="text-center">Application No.</div>
						<div className="text-center">Applicant Name</div>
						<div className="text-center">Submission Date</div>
						<div className="text-center">Time</div>
						<div className="text-center">Nationality</div>
						<div className="text-center">Score</div>
						<div className="text-center"> </div>
					</div>

					<div className="overflow-y-auto max-h-[63vh]">
						{currentApplicants.map((applicant, index) => {
							const { textColor, bgColor } = getScoreStyles(
								applicant.score
							);

							return (
								<div
									key={index}
									className="grid grid-cols-[1fr_1.5fr_1.2fr_1.3fr_1.2fr_0.8fr_0.4fr] gap-4 border-b px-2 py-2 items-center hover:bg-gray-50 transition duration-200 text-sm overflow-scroll"
								>
									<div className="text-center">
										{applicant.applicationNumber}
									</div>
									<div className="text-center">
										{applicant.applicantName}
									</div>
									<div className="text-center">
										{applicant.applicantDateOfBirth}
									</div>
									<div className="text-center">
										{applicant.submissionTime}
									</div>
									<div className="text-center">
										{applicant.nationality}
									</div>
									<div className="flex justify-center">
										<span
											className={`w-7 h-7 px-1 py-1 text-center rounded-md font-semibold ${textColor} ${bgColor}`}
										>
											{applicant.score}
										</span>
									</div>
									<div className="flex justify-center">
										<Link
											to={`/applicant/${applicant.applicationNumber}`}
										>
											<HiOutlineDotsVertical className="cursor-pointer hover:text-tum-blue" />
										</Link>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>

			<div className="fixed bottom-6 left-[calc(50%+128px)] transform -translate-x-1/2">
				<Pagination
					totalPages={totalPages}
					currentPage={currentPage}
					setCurrentPage={setCurrentPage}
				/>
			</div>
		</Layout>
	);
}
