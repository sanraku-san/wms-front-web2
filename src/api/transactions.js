import { URL } from "./configuration";

export const getTransactions = async () => {
  const authToken = sessionStorage.getItem("authToken");
  if (!authToken) {
    throw new Error("No authentication token found.");
  }

  try {
    const response = await fetch(`${URL}/transactions`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to fetch transactions:", errorData);
      throw new Error(errorData.message || "Failed to fetch transactions.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

export const getTransactionByID = async (id) => {
    const authToken = sessionStorage.getItem("authToken");
    if (!authToken) {
      throw new Error("No authentication token found.");
    }
  
    try {
      const response = await fetch(`${URL}/transactions/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to fetch transaction data:", errorData);
        throw new Error(errorData.message || "Failed to fetch transaction data.");
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error fetching transaction data:", error);
      throw error;
    }
  };

export const createTransaction = async (orderData, authToken) => {
    if (!authToken) {
      authToken = sessionStorage.getItem("authToken");
    }
    
    if (!authToken) {
      throw new Error("No authentication token found.");
    }
  
    try {
      const response = await fetch(`${URL}/transactions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json", 
          Accept: "application/json",
        },
        body: JSON.stringify(orderData), 
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to create transaction:", errorData);
        throw new Error(errorData.message || "Failed to create transaction.");
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw error;
    }
  };

export const deleteTransaction = async (id) => {
  const authToken = sessionStorage.getItem("authToken");
  
  if (!authToken) {
    throw new Error("No authentication token found.");
  }

  try {
    const response = await fetch(`${URL}/transactions/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to delete transaction:", errorData);
      throw new Error(errorData.message || "Failed to delete transaction.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
};

export const editTransaction = async (id, formData) => {
  const authToken = sessionStorage.getItem("authToken");
  
  if (!authToken) {
    throw new Error("No authentication token found.");
  }

  try {
    const response = await fetch(`${URL}/transactions/${id}`, {
      method: "POST", 
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: "application/json",
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to edit transaction:", errorData);
      throw new Error(errorData.message || "Failed to edit transaction.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error editing transaction:", error);
    throw error;
  }
};