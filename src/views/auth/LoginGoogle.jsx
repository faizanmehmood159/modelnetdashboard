import React, { useEffect, useState } from "react";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "api/company/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const LoginGoogle = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState([]);
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(false);

  console.log(email);

  const responseOutput = (response) => {
    console.log(response);
  };
  const errorOutput = (error) => {
    console.log(error);
  };

  const login = useGoogleLogin({
    onSuccess: (response) => setUserInfo(response),
    onError: (error) => console.log(`Login Failed: ${error}`),
  });

  useEffect(() => {
    const fetchData = async () => {
      if (userInfo) {
        try {
          setLoading(true);
          const response = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${userInfo.access_token}`,
            {
              headers: {
                Authorization: `Bearer ${userInfo.access_token}`,
                Accept: "application/json",
              },
            }
          );
          setEmail(response.data.email);

          try {
            const signInResponse = await signIn({
              email: response.data.email,
              password: "",
              signUpType: "googleSignin",
              secretKey: "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",
            });
            console.log("Sign-in API Response:", signInResponse.data);
            if (signInResponse.data.status === 200) {
              if (signInResponse.data.data.adminType === "company") {
                localStorage.setItem("adminType", "company");
                localStorage.setItem("id", signInResponse.data.data.id);
                localStorage.setItem(
                  "jwttoken",
                  signInResponse.data.data.jwttoken
                );
                navigate("/company/dashboard");
                toast.success(signInResponse.data.message);
              } else {
                localStorage.setItem("adminType", "companyUser");
                localStorage.setItem("id", signInResponse.data.data.id);
                localStorage.setItem(
                  "jwttoken",
                  signInResponse.data.data.jwttoken
                );
                navigate("/company/dashboard");
                toast.success(signInResponse.data.message);
              }
            }
          } catch (error) {
            console.error("Error signing in:", error);
            toast.error(error.response.data.message);
            if (
              error.response.data.message === "User Not found. Signup First"
            ) {
              navigate("/auth/signup");
            }
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [userInfo]);

  const handleGoogleLoginClick = () => {
    login();
  };

  return (
    <>
      {loading ? (
        <div className="mt-20 flex h-full items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-brand-50"></div>
        </div>
      ) : (
        <div>
          <button
            onClick={handleGoogleLoginClick}
            className="bg-base-100 mb-6 flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-brand-50 hover:cursor-pointer dark:bg-brand-300"
          >
            <div className="rounded-full text-xl text-white">
              <FcGoogle />
            </div>
            <h5 className="text-sm font-medium text-navy-700 text-white">
              Login with Google
            </h5>
          </button>
        </div>
      )}
    </>
  );
};

export default LoginGoogle;
