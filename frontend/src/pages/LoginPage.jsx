import React, { useState } from "react";
import TUMLogo from "../components/Logo/TUMLogo";
import { useNavigate } from "react-router-dom";
import { ToastContainer, Zoom, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OtpInput from "react-otp-input";

const customToastStyle = {
    background: "#fff",
    color: "#333",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
};


const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    const sendVerificationCode = async () => {
        console.log("sendVerificationCode triggered");
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Invalid email format. Please try again!");
            return;
        }
        setError("");

        try {
            const response = await fetch("http://localhost:8000/api/send-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Failed to send verification code.");
            }
            toast.success("Verification code sent to your email!", { autoClose: 3000, style: customToastStyle });
            setStep(2);
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Failed to send verification code.", { autoClose: 3000, style: customToastStyle });
        }
    };

    const verifyCode = async () => {
        console.log("verifyCode triggered");
        if (!code || code.length !== 6) {
            setError("Please enter a valid 6-digit code.");
            return;
        }
        setError("");

        try {
            const response = await fetch("http://localhost:8000/api/verify-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code }),
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Verification failed.");
            }
            toast.success("Login successful!", { autoClose: 2000, style: customToastStyle });
            // Redirect to another page
            setTimeout(() => navigate("/applicants"), 2000);
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Verification failed.", { autoClose: 3000, style: customToastStyle });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">

            <ToastContainer
                position="top-center"
                transition={Zoom}
                pauseOnHover={false}
                hideProgressBar
                closeButton={false}
                newestOnTop
                draggable={false}
                toastStyle={customToastStyle}
            />
            {/* Top left logo, can be removed */}
            <div className="absolute top-4 left-6 z-10">
                <TUMLogo className="w-12 h-12" />
            </div>

            {/* Centered container with fixed width and height */}
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

                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`w-full px-4 py-2 border ${error ? "border-red-500" : "border-gray-300"
                                        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

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
                                    Verify Your Account
                                </h2>
                                <p className="text-gray-600 text-sm mt-2">
                                    Insert the 5-digit code sent to your email.
                                </p>


                                <OtpInput
                                    value={code}
                                    onChange={setCode}
                                    numInputs={6}
                                    isInputNum={true}
                                    containerStyle="flex justify-center gap-2 mt-4"
                                    inputStyle={{
                                        width: "2.5rem",
                                        height: "2.5rem",
                                        borderRadius: "8px",
                                        border: "1px solid #ddd",
                                        textAlign: "center",
                                        fontSize: "1.5rem",
                                        fontWeight: "bold",
                                    }}
                                    renderInput={(props) => <input {...props} />}
                                />

                                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                                <button
                                    onClick={verifyCode}
                                    className="w-full bg-[#0284C7] text-white py-2 mt-4 rounded-md hover:bg-[#026BA3]"
                                >
                                    CONFIRM
                                </button>

                                {/* resend code */}
                                <p
                                    className="text-blue-600 text-sm mt-3 cursor-pointer hover:underline"
                                    onClick={sendVerificationCode}
                                >
                                    Resend Code
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
