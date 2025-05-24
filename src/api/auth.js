
import { URL } from './configuration'; 
//login
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Login failed:', errorData);
      throw new Error(errorData.message || 'Login failed. Please check your credentials.');
    }

    return await response.json();
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

//logout
export const logoutUser = async () => {
    const authToken = sessionStorage.getItem('authToken');
    if (!authToken) {
      throw new Error('No authentication token found.');
    }
  
    try {
      const response = await fetch(`${URL}/logout`, { 
        method: 'POST', 
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Accept': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Logout failed:', errorData);
        throw new Error(errorData.message || 'Logout failed');
      }
      
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

//getting logged in user
  export const getUser = async (authToken) => {
  try {
    const response = await fetch(`${URL}/profile`, { 
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json', 
      },
    });

    if (!response.ok) {
      
      let errorMessage = 'Failed to fetch user data';
      try {
        const errorData = await response.json();
        if (errorData && errorData.message) {
          errorMessage = errorData.message; 
        }
      } catch (jsonError) {
        
        console.error("Error parsing error response", jsonError);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    
    console.error('Error fetching user data:', error);
    throw error; 
  }
};