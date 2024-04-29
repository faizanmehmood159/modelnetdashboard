import axios from "axios";
import { API_BASE_URL_USER } from "api/config";

export const signUp = async (body) => {
  const response = await axios.post(`${API_BASE_URL_USER}signUp`, body);
  return response;
};
