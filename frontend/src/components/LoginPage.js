import React, { useState } from "react";
import TUMLogo from "../assets/tum-logo.svg";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [step, setStep] = useState(1);

    const sendVerificationCode = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Invalid email format. Please try again!");
            return;
        }
        setError("");

        try {
            const response = await fetch("http://localhost:5000/api/send-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Failed to send verification code.");
            }
            alert("Verification code sent to your email!");
            setStep(2);
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to send verification code.");
        }
    };

    const verifyCode = async () => {
        if (!code) {
            setError("Please enter the verification code.");
            return;
        }
        setError("");

        try {
            const response = await fetch("http://localhost:5000/api/verify-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code }),
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Verification failed.");
            }
            alert("Login successful!");
            // 跳转到其他页面
        } catch (err) {
            console.error(err);
            setError(err.message || "Verification failed.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
            {/* 左上角 Logo，可去掉 */}
            <div className="absolute top-4 left-6 z-10">
                <img src={TUMLogo} alt="TUM Logo" className="w-12 h-12" />
            </div>

            {/* 固定像素宽高，居中容器 */}
            <div className="relative w-[1200px] h-[720px] bg-white shadow-md rounded-lg flex overflow-hidden">
                <div className="flex-1 bg-[#E0E0E0] relative">
                    <h1 className="absolute font-bold text-[8rem] text-[#0284C7] top-10 left-10 drop-shadow-lg">
                        TUM
                    </h1>
                    <h2 className="absolute font-bold text-[6rem] text-white top-[19rem] left-10 drop-shadow-lg">
                        Courses Checker
                    </h2>
                </div>
                <div className="flex-1 flex flex-col justify-center items-center bg-white px-8">
                    <div className="w-full max-w-md text-center">
                        {step === 1 && (
                            <>
                                <h2 className="text-3xl font-semibold mt-6 text-gray-800">
                                    Enter your email
                                </h2>
                                <p className="text-gray-600 text-sm mt-2">
                                    We will send a verification code to your email.
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
                                    onClick={sendVerificationCode}
                                    className="w-full bg-blue-600 text-white py-2 mt-4 rounded-md hover:bg-blue-700"
                                >
                                    Send Verification Code
                                </button>
                            </>
                        )}
                        {step === 2 && (
                            <>
                                <h2 className="text-3xl font-semibold mt-6 text-gray-800">
                                    Enter the verification code
                                </h2>
                                <p className="text-gray-600 text-sm mt-2">
                                    Check your email for the verification code.
                                </p>
                                <div className="mt-4">
                                    <input
                                        type="text"
                                        placeholder="Enter verification code"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        className={`w-full px-4 py-2 border ${error ? "border-red-500" : "border-gray-300"
                                            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    />
                                    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                                </div>
                                <button
                                    onClick={verifyCode}
                                    className="w-full bg-blue-600 text-white py-2 mt-4 rounded-md hover:bg-blue-700"
                                >
                                    Verify and Login
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
