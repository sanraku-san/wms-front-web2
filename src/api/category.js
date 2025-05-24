import { URL } from "./configuration";

//retrieve
export const getCategories = async () => {
    const authToken = sessionStorage.getItem('authToken'); 
  
    try {
      const response = await fetch(`${URL}/categories`, { 
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`, 
          'Accept': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to fetch categories:', errorData);
        throw new Error(errorData.message || 'Failed to fetch categories');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  };