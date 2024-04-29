import React, { useState } from "react";
import forgotImg from "../../assets/img/auth/forgotImg.png";
import OtpInput from "react-otp-input";
import { useNavigate, useLocation } from "react-router-dom";

export default function Forgot2() {
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const otpRegex = /^\d{6}$/;
    if (!otpRegex.test(otp)) {
      setOtpError("Please enter a valid 6-digit OTP.");
      return;
    } else {
      setOtpError("");
    }
    navigate("/auth/changePassword", { state: { email, otp } });
  };
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-96 rounded bg-white p-6 shadow-md">
        <div className="flex items-center justify-center py-6">
          <img className="h-20" src={forgotImg} alt="forgot" />
        </div>
        <h1 className="text-md mb-4 text-center">
          Please enter OTP sent on your mail.
        </h1>
        <div className="flex w-full items-center justify-center">
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderSeparator={<span> </span>}
            renderInput={(props) => <input {...props} pattern="[0-9]*" />}
            inputStyle="h-12 text-brand-500 focus:text-orange-500 text-3xl m-3  border-b-2 border-brand-500 focus:outline-none focus:border-orange-500"
          />
        </div>
        <div className="flex w-full flex-row items-center justify-center">
          {otpError && <p className="mt-1 text-sm text-red-500">{otpError}</p>}
        </div>

        <button
          onClick={handleVerifyOtp}
          className="focus:shadow-outline-brand mt-6 w-full self-center rounded bg-brand-500 p-2 text-white hover:bg-brand-700 focus:outline-none"
        >
          Verify
        </button>
      </div>
    </div>
  );
}
