import { API_AUTH_URL } from "api/config";
import { API_URL } from "api/config";
import axios from "axios";

export const getAllComplaints = async () => {
  try {
    const response = await axios.get(`${API_URL}getAllComplaints`, {});
    return response;
  } catch (error) {
    throw error;
  }
};

export const resolveComplaint = async (selectedComplaintId) => {
  console.log(selectedComplaintId);
  const res = {
    complaintId: selectedComplaintId,
    status: "resolved",
  };
  try {
    const response = await axios.post(
      `${API_AUTH_URL}resolveComplaint?complaintId=${res.complaintId}&status=${res.status}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};
