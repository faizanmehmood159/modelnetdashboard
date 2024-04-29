import { API_BASE_URL } from "api/config";
import { API_BASE_URL_COMPANY } from "api/config";
import axios from "axios";

export const addInfoHub = async (body) => {
  const jwtToken = localStorage.getItem("jwttoken");
  try {
    const response = await axios.post(`${API_BASE_URL_COMPANY}infohub`, body, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateInfoHub = async (body) => {
  const jwtToken = localStorage.getItem("jwttoken");
  try {
    const response = await axios.post(
      `${API_BASE_URL_COMPANY}editInfohub`,
      body,
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

export const getInfoHub = async (body) => {
  const jwtToken = localStorage.getItem("jwttoken");

  try {
    const response = await axios.get(
      `${API_BASE_URL_COMPANY}getInfoHub`,
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

export const addInfo = async (body) => {
  const jwtToken = localStorage.getItem("jwttoken");

  try {
    const response = await axios.post(`${API_BASE_URL_COMPANY}info`, body, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getInfo = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}getInfo`, {});
    return response;
  } catch (error) {
    throw error;
  }
};
