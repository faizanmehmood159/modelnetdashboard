import { API_BASE_URL_COMPANY } from "api/config";
import axios from "axios";

export const companyStats = async () => {
  const jwtToken = localStorage.getItem("jwttoken");

  try {
    const response = await axios.get(`${API_BASE_URL_COMPANY}companyStats`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
