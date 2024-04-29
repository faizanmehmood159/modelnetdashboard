import { API_BASE_URL_COMPANY } from "api/config";
import axios from "axios";

export const sendOtp = async (email) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL_COMPANY}sendOtp?email=${email}`
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const forgetPassword = async (body) => {
  const response = await axios.post(
    `${API_BASE_URL_COMPANY}forgetPassword`,
    body
  );
  return response;
};
