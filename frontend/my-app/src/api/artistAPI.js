import { fetchAuthSession } from "aws-amplify/auth";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

const getToken = async () => {
  const session = await fetchAuthSession();
  return session.tokens?.idToken?.toString();
};

export const getFeaturedArtists = async () => {
  const response = await axios.get(`${API_URL}/api/artists/featured`);
  return response.data;
};

export const getMyArtistProfile = async () => {
  const token = await getToken();

  if (!token) {
    throw new Error("Missing ID token");
  }

  const response = await axios.get(`${API_URL}/api/artists/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

export const upsertMyArtistProfile = async (payload) => {
  const token = await getToken();

  if (!token) {
    throw new Error("Missing ID token");
  }

  const response = await axios.put(`${API_URL}/api/artists/me`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

export const getAdminArtistApplications = async (status = "PENDING") => {
  const token = await getToken();

  if (!token) {
    throw new Error("Missing ID token");
  }

  const response = await axios.get(`${API_URL}/api/artists/admin/applications`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { status },
  });

  return response.data;
};

export const approveArtistApplication = async (id) => {
  const token = await getToken();

  if (!token) {
    throw new Error("Missing ID token");
  }

  const response = await axios.patch(
    `${API_URL}/api/artists/admin/applications/${id}/approve`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return response.data;
};

export const rejectArtistApplication = async (id, rejectionReason) => {
  const token = await getToken();

  if (!token) {
    throw new Error("Missing ID token");
  }

  const response = await axios.patch(
    `${API_URL}/api/artists/admin/applications/${id}/reject`,
    { rejectionReason },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};
