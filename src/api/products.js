import { URL } from "./configuration";


//retrieve
export const getProducts = async () => {
  const authToken = sessionStorage.getItem("authToken");
  if (!authToken) {
    throw new Error("No authentication token found.");
  }

  try {
    const response = await fetch(`${URL}/products`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to fetch products:", errorData);
      throw new Error(errorData.message || "Failed to fetch products.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

//create
export const addProducts = async (formData) => {
  const authToken = sessionStorage.getItem("authToken");
  const response = await fetch(`${URL}/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
      Accept: "application/json",
    },
    body: formData,
  });
  if (!response.ok) throw new Error("Failed to add product");
  return await response.json();
}

//delete
export const deleteProduct = async (id) => {
  const authToken = sessionStorage.getItem("authToken");
  const res = await fetch(`${URL}/products/${id}`, {
    method: "DELETE",
    headers: {
     Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  return res.json();
};

export const editProduct = async (id, formData) => {
  const authToken = sessionStorage.getItem("authToken");
  const response = await fetch(`${URL}/products/${id}`, {
    method: "POST", // <-- CHANGE TO POST
    headers: {
      Authorization: `Bearer ${authToken}`,
      Accept: "application/json",
      // DO NOT set Content-Type
    },
    body: formData,
  });
  if (!response.ok) throw new Error("Failed to edit product");
  return await response.json();
};
