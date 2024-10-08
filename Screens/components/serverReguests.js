export async function login (username, password) {
    try {
      const response = await fetch('http://192.168.77.60:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set content type to JSON
        },
        body: JSON.stringify({ username, password }), // Convert JS object to JSON string
      });
  
      if (!response.ok) {
        const errorText = await response.text(); // Get error message if response is not ok
        throw new Error(errorText);
      }
  
      const data = await response.json(); // Parse the JSON response
      console.log('Token:', data.token); // Log the received token
      return data.token; // Return the token for further use
    } catch (error) {
      console.error('Error during login:', error.message); // Log any errors
      throw error; // Rethrow the error for further handling if needed
    }
  }

  export async function getCategories (token) {
    try {
      const response = await fetch('http://192.168.77.60:3000/getcategoriesWithToken', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json', // Set content type to JSON
          'x-access-token': token,
        }
      });
  
      if (!response.ok) {
        const errorText = await response.text(); // Get error message if response is not ok
        throw new Error(errorText);
      }
  
      const data = await response.json(); // Parse the JSON response
      console.log(data); // Log the received token
      return data; // Return the token for further use
    } catch (error) {
      console.error('Error during login:', error.message); // Log any errors
      throw error; // Rethrow the error for further handling if needed
    }
  }