import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { createPost } from './components/serverReguests';

const CreatePost = ({ navigation, route }) => {
  const { ogpostId } = route.params;
  const [postContent, setPostContent] = useState('');
  const [loading, setLoading] = useState(false); // Lisää loading-tila

  const handleSubmit = async () => {
  if (!postContent.trim()) {
    alert('Post content cannot be empty!');
    return;
  }

  setLoading(true); // Näytä lataustila

  try {
    // Kutsu createPost-funktiota ja lähetä viesti sekä categoryId
    await createPost(postContent, ogpostId);
    alert('Post created successfully!');
    navigation.goBack(); // Palaa edelliseen screeniin onnistuneen postauksen jälkeen
  } catch (error) {
    alert('Error creating post. Please try again.');
  } finally {
    setLoading(false); // Piilota lataustila
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Comment</Text>
      <TextInput
        style={styles.input}
        placeholder="Write your comment..."
        placeholderTextColor="#6F6F6F"
        multiline={true}
        value={postContent}
        onChangeText={setPostContent}
      />
      <Button title="Submit" onPress={handleSubmit} disabled={loading} />
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
});

export default CreateComment;
