import axios from "axios";
import { API_BASE_URL_COMPANY } from "api/config";

export const getUnApproveCompany = async () => {
  const jwtToken = localStorage.getItem("jwttoken");

  try {
    const response = await axios.get(
      `${API_BASE_URL_COMPANY}getUnApproveCompany`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getApprovedPendingCompany = async (token) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL_COMPANY}getApprovedPendingCompany?status=approved`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const approveCompany = async (id) => {
  const jwtToken = localStorage.getItem("jwttoken");

  try {
    const response = await axios.post(
      `${API_BASE_URL_COMPANY}approveCompany?companyId=${id}&approved=true&pending=false&rejected=false`,
      {},
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const rejectCompany = async (id) => {
  const jwtToken = localStorage.getItem("jwttoken");

  try {
    const response = await axios.post(
      `${API_BASE_URL_COMPANY}approveCompany?companyId=${id}&approved=false`,
      {},
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteCompany = async (id, token) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL_COMPANY}deleteCompany?id=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
