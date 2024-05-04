import { API_AUTH_URL } from "api/config";
import { API_URL } from "api/config";
import axios from "axios";

export const getAllInstallations = async () => {
  try {
    const response = await axios.get(`${API_URL}getInstallations`, {});
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const approveInstallation = async (id) => {
  console.log(id);
  const app = {
    appId: id,
    status: "approved",
  };
  try {
    const response = await axios.post(
      `${API_AUTH_URL}approveInstallation?installationFormId=${app.appId}&status=${app.status}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};


export const rejectInstallation = async (id) => {
  console.log(id);
  const rej = {
    rejId: id,
    status: "reject",
  };
  try {
    const response = await axios.post(
      `${API_AUTH_URL}approveInstallation?installationFormId=${rej.rejId}&status=${rej.status}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};