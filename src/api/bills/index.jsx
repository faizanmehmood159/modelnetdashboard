import { API_AUTH_URL } from "api/config";
import axios from "axios";
export const getAllBills = async () => {
    try {
      const response = await axios.get(`${API_AUTH_URL}getAllBills`, {});
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  export const approveBill = async (body) => {
    try {
      const response = await axios.put(`${API_AUTH_URL}bills`, body);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };