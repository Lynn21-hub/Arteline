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

export const placeOrderCOD = async (shippingDetails) => {
  const response = await axios.post(
    `${API_URL}/order/place-order/cod`,
    { shippingDetails },
    { headers: await getAuthHeaders() }
  );
  return response.data;
};

export const placeOrderStripe = async (shippingDetails) => {
  const response = await axios.post(
    `${API_URL}/order/place-order/stripe`,
    { shippingDetails },
    { headers: await getAuthHeaders() }
  );
  return response.data;
};

export const getUserOrders = async () => {
  const response = await axios.get(`${API_URL}/order`, {
    headers: await getAuthHeaders(),
  });
  return response.data;
};
