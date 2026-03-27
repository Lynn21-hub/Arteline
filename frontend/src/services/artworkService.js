import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api/artworks",
});

export const getAllArtworks = () => API.get("/");
export const getArtworkById = (id) => API.get(`/${id}`);
export const createArtwork = (formData) =>
  API.post("/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updateArtwork = (id, data) => API.put(`/${id}`, data);
export const deleteArtwork = (id) => API.delete(`/${id}`);