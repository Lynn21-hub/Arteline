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

export const getMySales = async () => {
  const response = await axios.get(`${API_URL}/order/artist/sales`, {
    headers: await getAuthHeaders(),
  });

  return response.data;
};
