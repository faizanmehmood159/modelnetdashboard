import { API_BASE_URL_COMPANY } from "api/config";
import axios from "axios";

export const setTopRated = async (selectedTopRatedCompanyId, token) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL_COMPANY}setTopRated?id=${selectedTopRatedCompanyId}&setTopRatedTo=true`,
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
export const setNotTopRated = async (selectedTopRatedCompanyId, token) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL_COMPANY}setTopRated?id=${selectedTopRatedCompanyId}&setTopRatedTo=false`,
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
