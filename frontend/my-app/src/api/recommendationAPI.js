import axios from "axios";

const BASE_URL = "http://localhost:5001";

export const getRecommendations = async (userId) => {
  try {
    const res = await axios.get(`${BASE_URL}/api/recommendations/${userId}`);
    return res.data.recommendations || [];
  } catch (err) {
    console.error("Recommendation API error:", err.response?.data || err.message);
    return [];
  }
};
