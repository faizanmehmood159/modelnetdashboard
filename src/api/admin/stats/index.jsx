import { API_AUTH_URL } from "api/config";
import axios from "axios";

export const getStats = async () => {
  try {
    const response = await axios.get(`${API_AUTH_URL}stats`, {});
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
