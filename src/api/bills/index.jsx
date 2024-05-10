import { API_URL } from "api/config";
import axios from "axios";
export const getAllBills = async () => {
    try {
      const response = await axios.get(`${API_URL}getAllBills`, {});
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };