// All server reguests for the app. Server hosted in google cloud: https://my-project-mobile-434712.ew.r.appspot.com/ 

// Log in reguest
// Log in to app and get auth token
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
};


// GET Functions

// All categories
export async function getCategories (token) {
  try {

    const response = await fetch('http://192.168.77.60:3000/getcategoriesWithToken', {

      method: 'GET',
      headers: {
        'Content-Type': 'application/json', // Set content type to JSON
        'x-access-token': token, // Send the auth token
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


// All posts from x category
export async function getPosts (id) {
  try {

    const response = await fetch('https://my-project-mobile-434712.ew.r.appspot.com/getcategoryposts/' + id, { // Send categoryId with the link to get the posts from that category
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', // Set content type to JSON
      }
    });

    console.log("sends" + 'https://my-project-mobile-434712.ew.r.appspot.com/getcategoryposts/' + id)

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

// All comments from x post
export async function getAllPostComments(postID) {
  try {
    const response = await fetch('https://my-project-mobile-434712.ew.r.appspot.com/getallpostcomments/' + postID, { // Send postId with the link to get the comments from that post
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


// Get one post for the comments screen
export async function getPost(postID) {
  try {
    const response = await fetch('https://my-project-mobile-434712.ew.r.appspot.com/getpost/' + postID, { // Send postId with the link to get the post data of the post
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


// POST Functions


// Post creation
export const createPost = async (message, categoryID) => {
try {
  const response = await fetch('https://my-project-mobile-434712.ew.r.appspot.com/addpost', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      message, // message = whatever you wrote in the post
      categoryID, 
    }),
  });

  const data = await response.json(); // Parse the JSON response

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create post');
  }

  return data; // Return success message
} catch (error) {
  console.error('Error creating post:', error);
  throw error; // Rethrow the error for further handling if needed
}
};

// Comment creation
export const createComment = async (message, ogpostid) => {
try {
  const response = await fetch('https://my-project-mobile-434712.ew.r.appspot.com/addcomment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message, // message = whatever you wrote in the comment
      ogpostid, // id of post on what you commented 
    }),
  });

  const data = await response.json(); // Parse the JSON response

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create post');
  }

  return data; // Return success message
} catch (error) {
  console.error('Error creating post:', error);
  throw error; // Rethrow the error for further handling if needed
}
};

