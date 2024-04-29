import { API_BASE_URL_COMPANY } from "api/config";
import axios from "axios";

export const getAllCompanyDetails = async (token) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL_COMPANY}getAllCompanyDetails`,
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
