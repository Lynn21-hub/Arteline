const BASE_URL = "http://localhost:5000/api/artworks";

export async function getAllArtworks() {
  const res = await fetch(BASE_URL);
  return res.json();
}

export async function getArtworkById(id) {
  const res = await fetch(`${BASE_URL}/${id}`);
  return res.json();
}

export async function createArtwork(data) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function updateArtwork(id, data) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function deleteArtwork(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  return res.json();
}