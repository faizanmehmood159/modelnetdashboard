import { API_BASE_URL_COMPANY } from "api/config";
import axios from "axios";

export const addCompanyDetails = async (body) => {
  const jwtToken = localStorage.getItem("jwttoken");

  try {
    const response = await axios.post(
      `${API_BASE_URL_COMPANY}addCompanyDetails`,
      body,
      {
        headers: {
          "Content-Type": "multipart/form-data",

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

export const getCompanyDetails = async (token) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL_COMPANY}getCompanyDetails`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateCompanyDetails = async (body) => {
  const jwtToken = localStorage.getItem("jwttoken");

  try {
    const response = await axios.post(
      `${API_BASE_URL_COMPANY}updateCompanyDetails`,
      body,
      {
        headers: {
          "Content-Type": "multipart/form-data",
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
