import React, { useState, useCallback } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity} from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import { createPost } from './components/serverReguests';
import { FetchUser, savePost, fetchSavedPost } from './components/db';

const CreatePost = ({ navigation, route }) => {
  const { categoryId, shouldLoadSavedPost } = route.params; // Destructure shouldLoadSavedPost
  const [postContent, setPostContent] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to fetch the saved post for the current user
  const loadSavedPost = async () => {
    try {
      const users = await FetchUser(); // Fetch the user from the database

      if (users.length === 0) {
        console.log('No user found to fetch saved post!');
        return;
      }

      const username = users[0].username; // Assuming 'username' is the field in the user table
      const savedPosts = await fetchSavedPost(username); // Fetch saved posts for the user

      if (savedPosts.length > 0) {
        // Assuming you want to use the first saved post
        setPostContent(savedPosts[0].savedPost); // Set the content of the saved post to the input field
      } else {
        console.log('No saved posts found for this user.');
      }
    } catch (error) {
      console.error('Error fetching saved post:', error);
    }
  };

  // Use useFocusEffect to call loadSavedPost when the screen is focused
  useFocusEffect(
    useCallback(() => {
      if (shouldLoadSavedPost) {
        loadSavedPost(); // Fetch saved post only if shouldLoadSavedPost is true
      }
    }, [shouldLoadSavedPost])
  );

  const handleSubmit = async () => {
    if (!postContent.trim()) {
      alert('Post content cannot be empty!');
      return;
    }

    setLoading(true);

    try {
      await createPost(postContent, categoryId);
      alert('Post created successfully!');
      navigation.goBack(); // Navigate back to the previous screen on success
    } catch (error) {
      alert('Error creating post. Please try again.');
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  const SaveMyPost = async () => {
    try {
      const users = await FetchUser(); // Fetch the user from the database

      if (users.length === 0) {
        alert('No user found to save the post!');
        return;
      }

      const username = users[0].username; // Assuming 'username' is the field in the user table
      
      await savePost(postContent, categoryId, username); // Save the post with postContent, categoryId, and the username
      backButton();
      alert('Post saved successfully!');
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Error saving post. Please try again.');
    }
  };

  const backButton = () => {
    navigation.goBack(); 
  };

  return (
    <View style={styles.container}>
        <View style={styles.headerContainer}>
        <TouchableOpacity onPress={backButton}>
          <Text style={styles.backButton}>{'\u2190'}</Text>
        </TouchableOpacity>
        <Text style={styles.header}>Create a New Post</Text>
      </View>
      
      <TextInput
        style={styles.input}
        placeholder="Write your post..."
        placeholderTextColor="#6F6F6F"
        multiline={true}
        value={postContent}
        onChangeText={setPostContent}
      />
      <Button title="Submit" onPress={handleSubmit} disabled={loading} />
      <Button title="Save post" onPress={SaveMyPost} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242424',
    padding: 20,
  },
  header: {
    color: 'white',
    fontSize: 28,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#181818',
    color: 'white',
    fontSize: 18,
    padding: 10,
    height: 150,
    marginBottom: 20,
    borderRadius: 5,
  },
  headerContainer: {
    flexDirection: 'row', // Aligns arrow and text horizontally
    alignItems: 'center', // Vertically center the arrow and text
    padding: 10,
    marginLeft: 10,
  },
  backButton: {
    color: "white",
    fontSize: 32,
    marginBottom: 27,
    marginRight: 20
  },
});

export default CreatePost;
