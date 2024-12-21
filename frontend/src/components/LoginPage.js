import React, { useState } from "react";
import TUMLogo from "../assets/tum-logo.svg"; // 确保路径正确

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
                backgroundColor: "#f5f5f5", // 设置页面背景色
            }}
        >
            {/* 左上角 TUM Logo */}
            <div
                style={{
                    position: "absolute",
                    top: "10px",
                    left: "30px",
                    zIndex: 100, // 确保 Logo 在最上层
                }}
            >
                <img
                    src={TUMLogo}
                    alt="TUM Logo"
                    style={{
                        width: "50px", // Logo 宽度
                        height: "50px", // Logo 高度
                    }}
                />
            </div>

            {/* 1334x800 主容器 */}
            <div
                className="relative"
                style={{
                    width: "1334px", // 固定宽度
                    height: "800px", // 固定高度
                    backgroundColor: "#ffffff", // 设置主容器背景色
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // 添加阴影
                    borderRadius: "8px", // 可选：主容器圆角
                    display: "flex", // 子元素 Flex 布局
                    overflow: "hidden", // 防止内容溢出
                }}
            >
                {/* 左侧区域 */}
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

                {/* 右侧区域 */}
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
