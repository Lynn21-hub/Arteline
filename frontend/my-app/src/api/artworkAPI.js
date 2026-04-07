import { fetchAuthSession } from "aws-amplify/auth";

const BASE_URL = "http://localhost:5000/api/artworks";

const parseResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Artwork request failed");
  }
  return data;
};

const getAuthHeaders = async () => {
  const session = await fetchAuthSession();
  const token = session.tokens?.accessToken?.toString();

  if (!token) {
    throw new Error("Missing auth token");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export async function getAllArtworks() {
  const res = await fetch(BASE_URL);
  return parseResponse(res);
}

export async function getMyArtworks() {
  const res = await fetch(`${BASE_URL}/mine`, {
    headers: await getAuthHeaders(),
  });
  return parseResponse(res);
}

export async function getArtworkById(id) {
  const res = await fetch(`${BASE_URL}/${id}`);
  return parseResponse(res);
}

export async function createArtwork(data) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return parseResponse(res);
}

export async function updateArtwork(id, data) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: await getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return parseResponse(res);
}

export async function deleteArtwork(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: await getAuthHeaders(),
  });

  return parseResponse(res);
}