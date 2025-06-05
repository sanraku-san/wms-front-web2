import { URL } from "./configuration";

export const getReports = async () => {
  const authToken = sessionStorage.getItem("authToken");
  const response = await fetch(`${URL}/varianceReport`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
      Accept: "application/json",
    },
  });
  if (!response.ok) throw new Error("Failed to fetch top 4 products");
  return await response.json();
};



export const createVarianceReport = async (reportData) => {
  const authToken = sessionStorage.getItem("authToken");
  const response = await fetch(`${URL}/varianceReport`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(reportData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create variance report");
  }
  const responseData = await response.json();
  const sanitizedData = {
    ...responseData.data,
    physical_stock: parseFloat(responseData.data.physical_stock) || 0,
    system_stock: parseFloat(responseData.data.system_stock) || 0,
    stock_difference: parseFloat(responseData.data.stock_difference) || 0,
    physical_sales: parseFloat(responseData.data.physical_sales) || 0,
    system_sales: parseFloat(responseData.data.system_sales) || 0,
    sales_difference: parseFloat(responseData.data.sales_difference) || 0,
  };
  return { ...responseData, data: sanitizedData };
};

