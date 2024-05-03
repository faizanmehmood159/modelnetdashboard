import { API_URL } from "api/config";
import axios from "axios";

export const getAllInstallations = async () => {
  try {
    const response = await axios.get(`${API_URL}getInstallations`, {});
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
