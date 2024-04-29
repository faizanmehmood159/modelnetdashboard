import React, { useState } from "react";
import forgotImg from "../../assets/img/auth/forgotImg.png";
import { useNavigate } from "react-router-dom";
import { sendOtp } from "api/forgot";
import { toast } from "react-toastify";

const Forgot1 = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSendMail = async (e) => {
    e.preventDefault();

    const validEmail = validateEmail(email);

    if (!validEmail) {
      setIsValidEmail(false);
      return;
    }

    setIsValidEmail(true);

    try {
      setLoading(true);
      const response = await sendOtp(email);
      console.log(response.data);
      if (response.data.status === 200) {
        toast.success(response.data.message);
        navigate("/auth/enterOtp", { state: { email } });
        setLoading(false);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-96 rounded bg-white p-6 shadow-md">
        <>
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-brand-50"></div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center py-6">
                <img className="h-20" src={forgotImg} alt="forgot" />
              </div>
              <h1 className="mb-4 text-2xl font-semibold">Forgot Password</h1>
              <form>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-bold text-gray-700"
                  >
                    Email Address to send OTP
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setIsValidEmail(true);
                    }}
                    className={`w-full border p-2 ${
                      isValidEmail ? "border-gray-300" : "border-red-500"
                    } rounded focus:border-brand-50 focus:outline-none`}
                    placeholder="example@example.com"
                  />
                  {!isValidEmail && (
                    <p className="mt-1 text-sm text-red-500">
                      Please enter a valid email address.
                    </p>
                  )}
                </div>
                <button
                  onClick={handleSendMail}
                  className="focus:shadow-outline-blue w-full self-center rounded bg-brand-500 p-2 text-white hover:bg-brand-50 focus:outline-none"
                >
                  Send OTP
                </button>
              </form>
            </>
          )}
        </>
      </div>
    </div>
  );
};

export default Forgot1;
