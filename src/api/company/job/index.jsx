import { API_BASE_URL_COMPANY } from "api/config";
import axios from "axios";

export const postJob = async (body) => {
  const jwtToken = localStorage.getItem("jwttoken");
  console.log(" responce " + API_BASE_URL_COMPANY);
  console.log("  asd", body);

  try {
    const response = await axios.post(`${API_BASE_URL_COMPANY}postJob`, body, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getPostedJob = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL_COMPANY}getPostedJob`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updatePostJob = async (body) => {
  const jwtToken = localStorage.getItem("jwttoken");

  try {
    const response = await axios.post(
      `${API_BASE_URL_COMPANY}updatePostJob`,
      body,
      {
        headers: {
          "Content-Type": "multipart/form-data",
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

export const deletePostJob = async (token, selectedPostId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL_COMPANY}deletePostJob?jobPostid=${selectedPostId}`,
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





export const enableJob = async (selectedJobIdTo, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL_COMPANY}enableDisableJob?_id=${selectedJobIdTo}&enable=true`,{},
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
export const disableJob = async (selectedJobIdTo, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL_COMPANY}enableDisableJob?_id=${selectedJobIdTo}&enable=false`,{},
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
