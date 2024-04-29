import { API_BASE_URL_COMPANY } from "api/config";
import axios from "axios";

export const getStats = async () => {
  const jwtToken = localStorage.getItem("jwttoken");

  try {
    const response = await axios.get(`${API_BASE_URL_COMPANY}stats`, {
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
