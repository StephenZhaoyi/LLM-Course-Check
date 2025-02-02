import React, { useEffect, useState } from "react";

const ModulesWithDetails = ({ isOpen, onClose, module }) => {
	const [selectedCourse, setSelectedCourse] = useState(module.courses[0]);
	// console.log("module", module);
	// console.log("selectedCourse", selectedCourse);

	useEffect(() => {
		if (module?.courses?.length > 0) {
			setSelectedCourse(module.courses[0]); // Set the first course if available
		} else {
			setSelectedCourse(null);
		}
	}, [module]);

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
								<div
									key={index}
									className={`h-12 border-gray border-b-2 cursor-pointer flex items-center px-2 overflow-x-scroll whitespace-nowrap ${
										selectedCourse?.course_id ===
										course.course_id
											? "bg-tum-blue text-white"
											: "hover:bg-tum-blue/10"
									}`}
									onClick={() => setSelectedCourse(course)}
								>
									{course.course_name}
								</div>
							))}
						</div>
					</div>

					<div className="mt-1">
						<h3 className="text-md font-semibold text-tum-blue border-tum-blue border-b-2 mb-1 pb-2">
							DETAILS
						</h3>
						{selectedCourse ? (
							<>
								<div className="h-12 flex items-center">
									<p className="font-bold">
										Deduction Recommendation:
									</p>
									<span className="ml-1"></span>
									{selectedCourse.deduction_recommendation}
								</div>
								<div className="flex flex-col">
									<p className="h-12 flex items-center font-bold">
										Explanation:
									</p>
									<p className="max-h-[21rem] overflow-y-scroll">
										{
											selectedCourse.explanation_recommendation
										}
									</p>
								</div>
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
