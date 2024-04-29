import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/img/auth/logo.png";
import { signUp } from "api/company/auth";
import { toast } from "react-toastify";
import { MdFileUpload } from "react-icons/md";

export default function SignUp() {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("null");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [companyImage, setCompanyImage] = useState(
    "https://gravatar.com/avatar/890f940dd9ba3a41bf63dcb1f1e1300d?s=400&d=mp&r=x"
  );
  const adminType = "company";

  const [firstNameError, setFirstNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [cPasswordError, setCPasswordError] = useState("");

  const handlefirstNameChange = (e) => {
    setFirstName(e.target.value);
    setFirstNameError("");
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  const handleCPasswordChange = (e) => {
    setCPassword(e.target.value);
    setCPasswordError("");
  };

  const handlecompanyImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setCompanyImage(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignUp = async () => {
    if (!firstName.trim()) {
      setFirstNameError("Please enter Company Name.");
      return;
    }
    if (!email.trim()) {
      setEmailError("Please enter your email.");
      return;
    } else if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    if (!password.trim()) {
      setPasswordError("Please enter your password.");
      return;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      return;
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/g.test(password)
    ) {
      setPasswordError(
        "Password must be a combination of letters (at least 1 uppercase & 1 lowercase), digits, & special characters."
      );
      return;
    }
    if (!cPassword.trim()) {
      setCPasswordError("Please confirm your password.");
      return;
    } else if (cPassword !== password) {
      setCPasswordError("Passwords do not match.");
      return;
    }
    setFirstNameError("");
    setEmailError("");
    setPasswordError("");
    setCPasswordError("");

    try {
      setLoading(true);
      const response = await signUp({
        firstName,
        lastName,
        email,
        password,
        cPassword,
        companyImage,
        adminType,
      });
      if (response.data.status === 200 && response.data.success === true) {
        toast.success("Signed Up Successfully.");
        setLoading(false);

        navigate("/auth/login");
      }
    } catch (error) {
      console.error("API Error:", error.response.data.message);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <div className="mt-20 flex h-full items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-brand-50"></div>
        </div>
      ) : (
        <>
          <div className="flex h-screen items-center justify-center">
            <div className="w-full max-w-[420px] bg-white p-4 shadow-lg">
              <div className="my-6 flex items-center justify-center">
                <img src={logo} alt="logo" className="h-10" />
              </div>

              <div className="mb-2">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-600"
                >
                  Company Name*
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-500 focus:outline-none"
                  placeholder="Enter Company Name..."
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={handlefirstNameChange}
                />
                {firstNameError && (
                  <p className="mt-2 text-center text-red-500">
                    {firstNameError}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="mb-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-600"
                >
                  Email*
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-500 focus:outline-none"
                  placeholder="Enter your email..."
                  id="email"
                  type="text"
                  value={email}
                  onChange={handleEmailChange}
                />
                {emailError && (
                  <p className="mt-2 text-center text-red-500">{emailError}</p>
                )}
              </div>

              {/* Password */}
              <div className="mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-600"
                >
                  Password*
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-500 focus:outline-none"
                  placeholder="Min. 8 characters"
                  id="password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                />
                {passwordError && (
                  <p className="mt-2 text-center text-red-500">
                    {passwordError}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="mb-2">
                <label
                  htmlFor="cPassword"
                  className="block text-sm font-medium text-gray-600"
                >
                  Confirm Password*
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-500 focus:outline-none"
                  placeholder="Confirm your password"
                  id="cPassword"
                  type="password"
                  value={cPassword}
                  onChange={handleCPasswordChange}
                />
                {cPasswordError && (
                  <p className="mt-2 text-center text-red-500">
                    {cPasswordError}
                  </p>
                )}
              </div>

              {/* company Image */}
              <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-2 3xl:grid-cols-2">
                <div className="relative mb-2 rounded-lg border border-dashed border-gray-300 p-4 text-center">
                  <label
                    htmlFor="companyImage"
                    className="block text-sm font-medium text-gray-600"
                  >
                    <MdFileUpload className="mx-auto mb-2 text-[80px] text-brand-500 dark:text-white" />
                    Click to upload User Image
                    <input
                      className="hidden"
                      id="companyImage"
                      type="file"
                      onChange={handlecompanyImageChange}
                    />
                  </label>
                </div>
                <div className="flex items-center justify-center rounded-lg border border-dashed border-gray-300">
                  <img
                    className="h-[14vh] w-auto"
                    src={companyImage}
                    alt="image"
                  />
                </div>
              </div>

              <button
                className="linear mt-2 w-full rounded-xl bg-brand-500 py-2 text-base font-medium text-white transition duration-200 hover:bg-brand-50 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
                onClick={handleSignUp}
              >
                Sign Up
              </button>

              <div className="mt-4">
                <span className="text-sm font-medium text-navy-700 dark:text-gray-600">
                  Already have an account?
                </span>
                <Link
                  to="/auth/login"
                  className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-50 dark:text-white"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
