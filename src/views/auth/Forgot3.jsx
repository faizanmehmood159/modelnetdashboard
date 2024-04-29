import React, { useState } from "react";
import forgotImg from "../../assets/img/auth/forgotImg.png";
import { useLocation, useNavigate } from "react-router-dom";
import { forgetPassword } from "api/forgot";
import { toast } from "react-toastify";

const Forgot3 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const otp = location.state?.otp || "";
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [cPasswordError, setCPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!password) {
      setPasswordError("Please enter a password.");
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
    } else if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must be a combination of letters (at least 1 uppercase & 1 lowercase), digits, & special characters."
      );
    } else {
      setPasswordError("");
    }

    if (!cPassword) {
      setCPasswordError("Please enter the confirmation password.");
    } else if (password !== cPassword) {
      setCPasswordError("Passwords do not match. Please try again.");
    } else {
      setCPasswordError("");
    }

    if (!passwordError && !cPasswordError) {
      try {
        setLoading(true);
        const response = await forgetPassword({
          email,
          otp,
          password,
          cPassword,
        });
        toast.success(response.data.message);
        navigate("/auth/login");
        setLoading(false);
      } catch (error) {
        toast.error(error.response.data.message);
        setLoading(false);
      } finally{
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-96 rounded bg-white p-6 shadow-md">
      <>
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-brand-600"></div>
            </div>
          ) : (
            <>
        <div className="flex items-center justify-center py-6">
          <img className="h-20" src={forgotImg} alt="forgot" />
        </div>
        <h1 className="mb-4 text-2xl font-semibold">Change Password</h1>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-bold text-gray-700"
            >
              New Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-gray-300 p-2 focus:border-brand-500 focus:outline-none"
            />
            {passwordError && (
              <p className="text-sm text-red-500">{passwordError}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="cPassword"
              className="mb-2 block text-sm font-bold text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="cPassword"
              name="cPassword"
              value={cPassword}
              onChange={(e) => setCPassword(e.target.value)}
              className="w-full rounded border border-gray-300 p-2 focus:border-brand-500 focus:outline-none"
            />
            {cPasswordError && (
              <p className="text-sm text-red-500">{cPasswordError}</p>
            )}
          </div>
          <button
            type="submit"
            className="focus:shadow-outline-brand w-full rounded bg-brand-500 p-2 text-white hover:bg-brand-700 focus:outline-none"
          >
            Change Password
          </button>
        </form>
        </>)}</>
      </div>
    </div>
  );
};

export default Forgot3;
