import { API_AUTH_URL } from "api/config";
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

export const addUser = async (data) => {
  try {
    const response = await axios.post(`${API_AUTH_URL}signup`, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id) => {
  console.log()
  try {
    const response = await axios.post(`${API_AUTH_URL}deleteUser?_id=${id}`,{});
    return response;
  } catch (error) {
    throw error;
  }
};
