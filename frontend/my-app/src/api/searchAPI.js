import axios from "axios";
console.log("CALLING SEARCH API");
const BASE_URL = "http://127.0.0.1:5001";
console.log("🚀 SEARCH API ROUTE REGISTERED");
export const searchArtworks = async (query) => {
 console.log("SEARCH AXIOS CALLED with query:", query);
  try {
    const res = await axios.get(`${BASE_URL}/api/search`, {
      params: { q: query },
    });
  console.log("Search AXIOS received + response:", res.data);
    return res.data;
  } catch (err) {
    console.error("Search AXIOS error:", err.response?.data || err.message);
    throw err;
  }
};