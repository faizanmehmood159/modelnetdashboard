import { API_URL } from "api/config";
import axios from "axios";

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}getAllUsers`, {});
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
