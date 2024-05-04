import { API_AUTH_URL } from "api/config";
import axios from "axios";

export const adminSignIn = async (data) => {
  try {
    const response = await axios.post(`${API_AUTH_URL}adminSignIn`, data);
    return response;
  } catch (error) {
    throw error;
  }
};
