import { API_BASE_URL_COMPANY } from "api/config";
import axios from "axios";

export const getCompanyDetails = async () => {
  const jwtToken = localStorage.getItem("jwttoken");

  try {
    const response = await axios.get(
      `${API_BASE_URL_COMPANY}getCompanyDetails`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const changePassword = async (body) => {
  const response = await axios.post(
    `${API_BASE_URL_COMPANY}changePassword`,
    body
  );
  return response;
};

export const getProfile = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL_COMPANY}getProfile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
