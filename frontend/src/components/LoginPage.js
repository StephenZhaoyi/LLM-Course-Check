import React, { useState } from "react";
import TUMLogo from "../assets/tum-logo.svg"; // Ensure the path is correct

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const handleSignIn = () => {
        const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Invalid Account, please try again!");
        } else {
            setError("");
            console.log("Sign-in with email:", email);
        }
    };

    return (
        <div
            className="relative flex justify-center items-center min-h-screen"
            style={{
                backgroundColor: "#f5f5f5", // Set page background color
            }}
        >
            {/* Top-left TUM Logo */}
            <div
                style={{
                    position: "absolute",
                    top: "10px",
                    left: "30px",
                    zIndex: 100, // Ensure the logo is on the top layer
                }}
            >
                <img
                    src={TUMLogo}
                    alt="TUM Logo"
                    style={{
                        width: "50px", // Logo width
                        height: "50px", // Logo height
                    }}
                />
            </div>

            {/* Main container (1334x800) */}
            <div
                className="relative"
                style={{
                    width: "1334px", // Fixed width
                    height: "800px", // Fixed height
                    backgroundColor: "#ffffff", // Set container background color
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Add shadow
                    borderRadius: "8px", // Optional: Rounded corners
                    display: "flex", // Flex layout for child elements
                    overflow: "hidden", // Prevent content overflow
                }}
            >
                {/* Left section */}
                <div
                    className="flex-1 relative"
                    style={{ backgroundColor: "#E0E0E0", height: "100%" }}
                >
                    <h1
                        className="absolute font-bold"
                        style={{
                            fontSize: "128px",
                            color: "#0284C7",
                            top: "40px",
                            left: "40px",
                            textShadow: "10px 10px 20px rgba(0, 0, 0, 0.25)",
                        }}
                    >
                        TUM
                    </h1>
                    <h2
                        className="absolute font-bold"
                        style={{
                            fontSize: "96px",
                            color: "#FFFFFF",
                            top: "303px",
                            left: "40px",
                            textShadow: "10px 10px 20px rgba(0, 0, 0, 0.25)",
                        }}
                    >
                        Courses Checker
                    </h2>
                </div>

                {/* Right section */}
                <div className="flex-1 flex flex-col justify-center items-center bg-white px-8">
                    <div className="w-full max-w-md text-center">
                        <h2 className="text-3xl font-semibold mt-6 text-gray-800">
                            Create an account
                        </h2>
                        <p className="text-gray-600 text-sm mt-2">
                            Enter your email below to create your account
                        </p>
                        <div className="mt-4">
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full px-4 py-2 border ${error ? "border-red-500" : "border-gray-300"
                                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                        </div>
                        <button
                            onClick={handleSignIn}
                            className="w-full bg-blue-600 text-white py-2 mt-4 rounded-md hover:bg-blue-700"
                        >
                            Sign In with Email
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
