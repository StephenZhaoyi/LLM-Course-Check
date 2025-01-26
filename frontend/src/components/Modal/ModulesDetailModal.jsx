import React, { useState } from "react";

const ModulesWithDetails = ({ isOpen, onClose, module }) => {
	const [selectedCourse, setSelectedCourse] = useState(module.courses[0]);

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
			onClick={onClose}
		>
			<div
				className="bg-white rounded-lg shadow-lg w-[48rem] h-[36rem] p-6 relative"
				onClick={(e) => e.stopPropagation()}
			>
				<h2 className="text-lg border-gray border-b-2 font-semibold mb-2 pb-2">
					{module.name}
				</h2>
				<div className="grid grid-cols-2 gap-8">
					<div className="mt-1">
						<h3 className="text-md font-semibold text-tum-blue border-tum-blue border-b-2 mb-1 pb-2">
							COURSES
						</h3>
						<div className="max-h-[27rem] overflow-y-scroll">
							{module.courses?.map((course, index) => (
								<li
									key={index}
									className={`h-12 border-gray border-b-2 cursor-pointer flex items-center px-2 overflow-x-scroll whitespace-nowrap ${
										selectedCourse?.courseId ===
										course.courseId
											? "bg-tum-blue text-white"
											: "hover:bg-tum-blue/10"
									}`}
									onClick={() => setSelectedCourse(course)}
								>
									{course.courseName}
								</li>
							))}
						</div>
					</div>

					<div className="mt-1">
						<h3 className="text-md font-semibold text-tum-blue border-tum-blue border-b-2 mb-1 pb-2">
							DETAILS
						</h3>
						{selectedCourse ? (
							<>
								<p className="h-12 flex items-center">
									<p className="font-bold">
										Deduction Recommendation:
									</p>
									<span className="ml-1"></span>
									{selectedCourse.deductionRecommendation}
								</p>
								<p className="flex flex-col">
									<p className="h-12 flex items-center font-bold">
										Explanation:
									</p>
									<p className="max-h-[21rem] overflow-y-scroll">
										{selectedCourse.explanationRecommendation}
									</p>
								</p>
							</>
						) : (
							<p>No course selected.</p>
						)}
					</div>
				</div>

				<button
					onClick={onClose}
					className="absolute top-5 right-6 text-red-500 font-semibold"
				>
					❌
				</button>
			</div>
		</div>
	);
};

export default ModulesWithDetails;
