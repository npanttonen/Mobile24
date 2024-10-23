export async function login (username, password) {
    try {
      const response = await fetch('http://192.168.50.47:3000/login', {

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
  };

  export async function getCategories (token) {
    try {

      const response = await fetch('http://192.168.50.47:3000/getcategoriesWithToken', {

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
  };

  export async function getPosts (id) {
    try {

      const response = await fetch('http://192.168.50.47:3000/getcategoryposts/' + id, {

        method: 'GET',
        headers: {
          'Content-Type': 'application/json', // Set content type to JSON
          //'x-access-token': token,
        }
      });

      console.log("sends" + 'http://192.168.50.47:3000/getcategoryposts/' + id)

      if (!response.ok) {
        const errorText = await response.text(); // Get error message if response is not ok
        throw new Error(errorText);
      }
  
      const data = await response.json(); // Parse the JSON response
      console.log(data); 
      return data; 
    } catch (error) {
      console.error('Error during login:', error.message); // Log any errors
      throw error; // Rethrow the error for further handling if needed
    }
  };

  export async function getAllPostComments(postID) {
    try {
      const response = await fetch('http://192.168.50.47:3000/getallpostcomments/' + postID, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json', // Set content type to JSON
        }
      });
  
      if (!response.ok) {
        const errorText = await response.text(); // Get error message if response is not ok
        throw new Error(errorText);
      }
  
      const data = await response.json(); // Parse the JSON response
      console.log(data); // Log the response
      return data; // Return the data for further use
    } catch (error) {
      console.error('Error during fetching comments:', error.message); // Log any errors
      throw error; // Rethrow the error for further handling if needed
    }
  }

  export async function getPost(postID) {
    try {
      const response = await fetch('http://192.168.50.47:3000/getpost/' + postID, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json', // Set content type to JSON
        }
      });
  
      if (!response.ok) {
        const errorText = await response.text(); // Get error message if response is not ok
        throw new Error(errorText);
      }
  
      const data = await response.json(); // Parse the JSON response
      console.log(data); // Log the response
      return data; // Return the data for further use
    } catch (error) {
      console.error('Error during fetching post:', error.message); // Log any errors
      throw error; // Rethrow the error for further handling if needed
    }

  }

  //postauksenteko
const API_URL = 'http://172.31.78.22:3000/addpost'; // Muuta tämä API-osoitteesi mukaan


export const createPost = async (message, categoryID) => {
  try {
    const response = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        categoryID,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create post');
    }

    return data; // Palauta onnistunut vastaus
  } catch (error) {
    console.error('Error creating post:', error);
    throw error; // Heitetään virhe eteenpäin käsittelyä varten
  }
};

//kommentin teko
const API_COMMENT_URL = 'http://192.168.50.47:3000/addcomment'; // Muuta tämä API-osoitteesi mukaan
export const createComment = async (message, ogpostid) => {
  try {
    const response = await fetch(`${API_COMMENT_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        ogpostid,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create post');
    }

    return data; // Palauta onnistunut vastaus
  } catch (error) {
    console.error('Error creating post:', error);
    throw error; // Heitetään virhe eteenpäin käsittelyä varten
  }
};

