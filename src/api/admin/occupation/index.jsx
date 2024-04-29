import axios from "axios";
import { API_BASE_URL_COMPANY } from "api/config";

export const titleSubtitle = async (body) => {
  const jwtToken = localStorage.getItem("jwttoken");

  try {
    const response = await axios.post(
      `${API_BASE_URL_COMPANY}titleSubtitle`,
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
