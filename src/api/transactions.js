import { URL } from "./configuration";


//retrieve
export const getTransactions = async () => {
    const authToken = sessionStorage.getItem('authToken');
    if (!authToken) {
      throw new Error('No authentication token found.');
    }
  
    try {
      const response = await fetch(`${URL}/transactions`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to fetch transactions:', errorData);
        throw new Error(errorData.message || 'Failed to fetch transactions.');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  };

  //create
export const createTransaction = async (transactionData) => {
  const authToken = sessionStorage.getItem('authToken'); 
  if (!authToken) {
      throw new Error('Authentication token is required');
  }

  try {
      const response = await fetch(`${URL}/transactions`, { 
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`, 
          },
          body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
          
          let errorMessage = 'Failed to create transaction';
          try {
              const errorJson = await response.json();
              if (errorJson && errorJson.message) {
                  errorMessage = errorJson.message;
              }
          } catch (parseError) {
              
              console.error("Error parsing error response:", parseError);
          }
          throw new Error(errorMessage);
      }

      const responseData = await response.json();
      return { success: true, data: responseData.data }; 
  } catch (error) {
      
      console.error("Error creating transaction:", error);
      throw error; 
  }
};