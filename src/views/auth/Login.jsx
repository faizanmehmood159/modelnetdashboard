import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/img/auth/logo.png";
import { toast } from "react-toastify";
import { adminSignIn } from "api/admin/admin";
export default function Login() {
  const [email, setEmail] = useState("modelNet@gmail.com");
  const [password, setPassword] = useState("ModelNet512");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const login = localStorage.getItem("login");
    console.log(typeof(login))
    if (login === 'true') {
      navigate("/admin");
    }
    console.log(login);
  });

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  };
  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setEmailError("Please enter your email.");
      return;
    } else if (!isEmailValid(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    if (!password.trim()) {
      setPasswordError("Please enter your password.");
      return;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      return;
    }
    setEmailError("");
    setPasswordError("");
    try {
      setLoading(true);
      const data = {
        email: email,
        password: password,
      };
      const response = await adminSignIn(data);
      if (
        response.data.success === true
      ) {
        localStorage.setItem("login", true);
        navigate("/admin");
        toast.success(response.data.message);
      }else {
        toast.error("error sign in!");
      }
      setLoading(false);
    } catch (error) {
      toast.error("Email or password is incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      
          <div className="flex h-screen items-center justify-center">
            <div className="w-full max-w-[420px] rounded-tl-full rounded-tr-full bg-white p-4 shadow-lg">
              <div className="rounded-tl-full rounded-tr-full bg-blue-100 p-4">
              {loading ? (
        <div className="my-10 mb-8 flex h-full items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-brand-50"></div>
        </div>
      ) : (
        <>
                <div className="my-6 flex items-center justify-center">
                  <img src={logo} alt="logo" className="h-32" />
                </div>
                <form onSubmit={handleSubmit}>
                  {/* Email */}
                  <div className="mb-3">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-600"
                    >
                      Email*
                    </label>
                    <input
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-500 focus:outline-none"
                      placeholder="mail@simple.com"
                      id="email"
                      type="text"
                      value={email}
                      onChange={handleEmailChange}
                    />
                  </div>
                  {emailError && (
                    <p className="text-center text-red-500">{emailError}</p>
                  )}

                  {/* Password */}
                  <div className="mb-3">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-600"
                    >
                      Password*
                    </label>
                    <input
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-50 focus:outline-none"
                      placeholder="Min. 8 characters"
                      id="password"
                      type="password"
                      value={password}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  {passwordError && (
                    <p className="text-center text-red-500">{passwordError}</p>
                  )}

                  <button
                    type="submit"
                    className="linear mt-2 w-full rounded-xl bg-brand-500 py-2 text-base font-medium text-white transition duration-200 hover:bg-brand-50 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-50 dark:active:bg-brand-500"
                  >
                    Login
                  </button>
                </form>
                </>
                )}
              </div>
            </div>
          </div>
      
      
    </>
  );
}
