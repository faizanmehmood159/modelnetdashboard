import { API_BASE_URL_COMPANY } from "api/config";
import axios from "axios";

export const getAppointments = async (companyId, token) => {

  try {
    const response = await axios.get(
      `${API_BASE_URL_COMPANY}getAppointments?companyId=${companyId}`,
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


export const getAppointmentsCompanyUser = async (companyId, token) => {

  try {
    const response = await axios.get(
      `${API_BASE_URL_COMPANY}getAppointments?companyUserId=${companyId}`,
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

export const approveAppintments = async (appointmentId) => {
  const token = localStorage.getItem("jwttoken");
  try {
    const response = await axios.post(
      `${API_BASE_URL_COMPANY}approveAppintments?appointmentId=${appointmentId}&isApproved=true`,
      {},
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

export const rejectAppointment = async (appointmentId) => {
  const token = localStorage.getItem("jwttoken");
  try {
    const response = await axios.post(
      `${API_BASE_URL_COMPANY}approveAppintments?appointmentId=${appointmentId}&isApproved=false`,
      {},
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

export const finishAppointment = async (
  appointmentIdToReview,
  rating,
  reviewText
) => {
  const token = localStorage.getItem("jwttoken");
  try {
    const response = await axios.post(
      `${API_BASE_URL_COMPANY}finishAppointment?appointmentId=${appointmentIdToReview}&rating=${rating}&feedback=${reviewText}&isFinished=true`,
      {},
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

export const getFinishedAppointments = async (
  selectedOption,
  searchValue,
  token
) => {
  console.log(
    token,
    " jhsjdh hjsdg fjsjhd",
    selectedOption,
    " jhsjdh hjsdg fjsjhd",
    searchValue
  );
  try {
    const response = await axios.get(
      `${API_BASE_URL_COMPANY}getFinishedAppointments?${selectedOption}=${searchValue}`,
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

export const getFinishedAppointmentsLocation = async (
  longitude,
  latitude,
  token
) => {
  console.log(
    token,
    " jhsjdh hjsdg fjsjhd",
    longitude,
    " jhsjdh hjsdg fjsjhd",
    latitude
  );
  if (longitude !== "") {
    try {
      const response = await axios.get(
        `${API_BASE_URL_COMPANY}getFinishedAppointments?longitude=${longitude}&latitude=${latitude}`,
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
  } else {
    console.log("enterlong lat");
  }
};

export const getAllFinishedAppointments = async (token) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL_COMPANY}getFinishedAppointments`,
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
