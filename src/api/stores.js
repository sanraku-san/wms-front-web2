import {URL} from "./configuration";

//retrive
export const getStores = async () => {
  const authToken = sessionStorage.getItem('authToken');
  if (!authToken) {
    throw new Error('No authentication token found.');
  }

  try {
    const response = await fetch(`${URL}/stores`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to fetch stores:', errorData);
      throw new Error(errorData.message || 'Failed to fetch stores.');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching stores:', error);
    throw error;
  }
};

//create
export const addStores = async (storeData) => {
  const authToken = sessionStorage.getItem('authToken'); 
  try {
    const response = await fetch(`${URL}/stores`, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(storeData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Add store failed:', errorData);
      throw new Error(errorData.message || 'Failed to add store');
    }

    const data = await response.json(); 
    return data; 
  } catch (error) {
    console.error('Error adding store:', error);
    throw error;
  }
};

//delete
export const deleteStore = async (id) => {
  const authToken = sessionStorage.getItem('authToken');
  const res = await fetch(`${URL}/stores/${id}`,{
    method:"DELETE",
    headers:{
      'Authorization': `Bearer ${authToken}`,
      "Content-Type":"application/json",
      Accept:"application/json",
    },
  });
  return res.json();
}
