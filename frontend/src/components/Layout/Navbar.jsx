import React from "react";
import TUMLogo from "../Logo/TUMLogo";
import { FaHome } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Navbar = () => {
	return (
		<header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
			<nav className="flex items-center justify-between h-10 px-8 py-1">
				<div className="flex items-center">
					<TUMLogo className="h-6 w-auto" />
				</div>
				<div className="flex items-center text-sm font-medium text-gray-700">
					<span>Tester</span>
					<span className="ml-1">▼</span>
				</div>
			</nav>
			<div className="flex items-center bg-gray-100 h-10 px-8 py-1 drop-shadow-sm">
				<div className="flex items-center gap-2">
					<div className="flex items-center">
						<NavLink
							to="/"
							className={({ isActive }) =>
								`text-sm font-medium ${
									isActive
										? "text-tum-blue underline"
										: "text-gray-700"
								}`
							}
						>
							<FaHome className="text-gray-600 size-4 m-1" />
						</NavLink>
					</div>
					<span className="text-sm font-semibold text-gray-800">
						Applicant List
					</span>
				</div>
			</div>
		</header>
	);
};

export default Navbar;
