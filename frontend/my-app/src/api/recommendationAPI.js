import axios from "axios";
import { API_URL } from "./config";

export const getRecommendations = async (userId) => {
  try {
    const res = await axios.get(`${API_URL}/api/recommendations/${userId}`);
    return res.data.recommendations || [];
  } catch (err) {
    console.error("Recommendation API error:", err.response?.data || err.message);
    return [];
  }
};
