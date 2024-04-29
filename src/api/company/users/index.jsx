import { API_BASE_URL_COMPANY } from "api/config";
import axios from "axios";

export const getCompanyUsers = async (id, token) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL_COMPANY}getCompanyUsers?id=${id}`,
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

export const deleteCompanyUsers = async (id, token) => {
  if (!token) {
    console.log("token not found");
  }
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.get(
      `${API_BASE_URL_COMPANY}deleteCompanyUsers?id=${id}`,
      {
        headers,
      }
    );

    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateCompanyUsers = async (body) => {
  const jwtToken = localStorage.getItem("jwttoken");

  try {
    const response = await axios.post(
      `${API_BASE_URL_COMPANY}updateCompanyUsers`,
      body,
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
