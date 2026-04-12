import { fetchAuthSession } from "aws-amplify/auth";
import axios from "axios";

const API_URL = "http://localhost:5001";

const getToken = async () => {
  const session = await fetchAuthSession();
  return session.tokens?.idToken?.toString();
};

export const addToCart = async (artworkId, quantity = 1) => {
  const token = await getToken();

  if (!token) {
    throw new Error("Missing ID token");
  }

  const response = await axios.post(
    `${API_URL}/cart/add`,
    { artworkId, quantity },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

export const getCart = async () => {
  const token = await getToken();

  if (!token) {
    throw new Error("Missing ID token");
  }

  const response = await axios.get(`${API_URL}/cart`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

export const updateCartQuantity = async (artworkId, quantity) => {
  const token = await getToken();

  if (!token) {
    throw new Error("Missing ID token");
  }

  const response = await axios.patch(
    `${API_URL}/cart/update-quantity`,
    { artworkId, quantity },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

export const removeFromCart = async (artworkId) => {
  const token = await getToken();

  if (!token) {
    throw new Error("Missing ID token");
  }

  const response = await axios.delete(`${API_URL}/cart/remove`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { artworkId },
  });

  return response.data;
};

export const getCheckoutSummary = async () => {
  const token = await getToken();

  if (!token) {
    throw new Error("Missing ID token");
  }

  const response = await axios.get(`${API_URL}/cart/checkout`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};