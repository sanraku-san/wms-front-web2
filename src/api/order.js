import { URL } from "./configuration";


export const getProductOrder = async () => {
  const authToken = sessionStorage.getItem("authToken");
  if (!authToken) {
    throw new Error("No authentication token found.");
  }

  try {
    const response = await fetch(`${URL}/productOrders`, {
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


export const getProductOrderByID = async (id) => {
    const authToken = sessionStorage.getItem("authToken");
    if (!authToken) {
      throw new Error("No authentication token found.");
    }
  
    try {
      const response = await fetch(`${URL}/productOrders/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to fetch order data:", errorData);
        throw new Error(errorData.message || "Failed to fetch order data.");
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error fetching order data:", error);
      throw error;
    }
  };
export const addProductOrder = async (orderData, authToken) => {
    if (!authToken) {
      authToken = sessionStorage.getItem("authToken");
    }
    
    if (!authToken) {
      throw new Error("No authentication token found.");
    }
  
    try {
      const response = await fetch(`${URL}/productOrders`, {
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
        console.error("Failed to create product order:", errorData);
        throw new Error(errorData.message || "Failed to create product order.");
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error creating product order:", error);
      throw error;
    }
  };

  export const checkoutOrder = async (orderData, authToken) => {
    if (!authToken) {
      authToken = sessionStorage.getItem("authToken");
    }
    
    if (!authToken) {
      throw new Error("No authentication token found.");
    }

    const orderId = orderData.order_id || orderData.id;
    
    if (!orderId) {
      throw new Error("Order ID is required for checkout.");
    }
  
    try {
      const response = await fetch(`${URL}/productOrders/checkout${orderId}`, {
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
        console.error("Failed to checkout order:", errorData);
        throw new Error(errorData.message || "Failed to checkout order.");
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error checking out order:", error);
      throw error;
    }
  };


//delete
export const deleteProductOrder = async (id) => {
  const authToken = sessionStorage.getItem("authToken");
  const res = await fetch(`${URL}/productOrders/${id}`, {
    method: "DELETE",
    headers: {
     Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  return res.json();
};

export const editProductOrder = async (id, formData) => {
  const authToken = sessionStorage.getItem("authToken");
  const response = await fetch(`${URL}/productOrders/${id}`, {
    method: "PATCH", 
    headers: {
      Authorization: `Bearer ${authToken}`,
      Accept: "application/json",
    },
    body: formData,
  });
  if (!response.ok) throw new Error("Failed to edit product");
  return await response.json();
};
