import { fetchAuthSession } from "aws-amplify/auth";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

const getToken = async () => {
  const session = await fetchAuthSession();
  return session.tokens?.idToken?.toString();
};

const getAuthHeaders = async () => {
  const token = await getToken();
  if (!token) {
    throw new Error("Missing ID token");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const getMyPayouts = async () => {
  const response = await axios.get(`${API_URL}/api/payouts/me`, {
    headers: await getAuthHeaders(),
  });
  return response.data;
};

export const getAdminPayouts = async (status) => {
  const response = await axios.get(`${API_URL}/api/payouts/admin`, {
    headers: await getAuthHeaders(),
    params: status ? { status } : undefined,
  });
  return response.data;
};

export const markPayoutPaid = async (id, paymentReference) => {
  const response = await axios.patch(
    `${API_URL}/api/payouts/admin/${id}/mark-paid`,
    { paymentReference },
    { headers: await getAuthHeaders() }
  );
  return response.data;
};
