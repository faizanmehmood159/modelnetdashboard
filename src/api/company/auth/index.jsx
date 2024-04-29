import axios from "axios";
import { API_BASE_URL_COMPANY } from "api/config";
export const signUp = async (body) => {
  const response = await axios.post(`${API_BASE_URL_COMPANY}signUp`, body);
  return response;
};

export const signIn = async (body) => {
  const response = await axios.post(`${API_BASE_URL_COMPANY}signIn`, body);
  return response;
};