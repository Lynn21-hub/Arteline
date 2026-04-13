import { fetchAuthSession } from "aws-amplify/auth";
import axios from "axios";


const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";


const getToken = async () => {
  const session = await fetchAuthSession();
  return session.tokens.accessToken.toString();
};

const getAuthHeaders = async () => {
  const token = await getToken();
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const placeOrderCOD = async () => {
  const response = await axios.post(
    `${API_URL}/order/place-order/cod`,
    {},
    { headers: await getAuthHeaders() }
  );
  return response.data;
};

export const placeOrderStripe = async () => {
  const response = await axios.post(
    `${API_URL}/order/place-order/stripe`,
    {},
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