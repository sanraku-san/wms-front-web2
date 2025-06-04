import { URL } from "./configuration";


export const getTopFourProducts = async () => {
  const authToken = sessionStorage.getItem("authToken");
  const response = await fetch(`${URL}/dashboard/topProducts`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
      Accept: "application/json",
    },
  });
  if (!response.ok) throw new Error("Failed to fetch top 4 products");
  return await response.json();
};


export const getCategoryCount = async () => {
  const authToken = sessionStorage.getItem("authToken");
  const response = await fetch(`${URL}/categoryCount`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
      Accept: "application/json",
    },
  });
  if (!response.ok) throw new Error("Failed to fetch category count");
  return await response.json();
};

export const getTotalStock = async () => {
  const authToken = sessionStorage.getItem("authToken");
  const response = await fetch(`${URL}/dashboard/totalStock`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
      Accept: "application/json",
    },
  });
  if (!response.ok) throw new Error("Failed to fetch total stock");
  return await response.json();
};

export const getLowStockProducts = async () => {
  const authToken = sessionStorage.getItem("authToken");
  const response = await fetch(`${URL}/dashboard/lowStock`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
      Accept: "application/json",
    },
  });
  if (!response.ok) throw new Error("Failed to fetch low stock products");
  return await response.json();
};

export const getOutOfStockProducts = async () => {
  const authToken = sessionStorage.getItem("authToken");
  const response = await fetch(`${URL}/dashboard/outOfStock`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
      Accept: "application/json",
    },
  });
  if (!response.ok) throw new Error("Failed to fetch out of stock products");
  return await response.json();
};

export const getMonthlyReport = async () => {
  const authToken = sessionStorage.getItem("authToken");
  const response = await fetch(`${URL}/dashboard/monthlyReport`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
      Accept: "application/json",
    },
  });
  if (!response.ok) throw new Error("Failed to fetch monthly report");
  return await response.json();
};