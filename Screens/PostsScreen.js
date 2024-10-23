import React, { useState, useRef, useEffect, useCallback } from "react";
import { FlatList, View, Text, Animated, PanResponder, StyleSheet, TouchableOpacity } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { getPosts, getAllPostComments } from "./components/serverReguests";

// Create a separate component for each post item
const PostItem = ({ item, navigation }) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy); // Only respond to horizontal movements
      },
      onPanResponderMove: (e, gestureState) => {
        if (gestureState.dx < 0) {
          pan.setValue({ x: gestureState.dx, y: 0 }); // Only allow dragging to the left
        }
      },
      onPanResponderRelease: async (e, gestureState) => {
        if (gestureState.dx < -100) {
          // Trigger action when swiping left
          try {
            const commentsData = await getAllPostComments(item._id); // Fetch comments for the post
            navigation.navigate("Comments", { post: item, comments: commentsData }); // Pass both post and comments data
          } catch (error) {
            console.error('Error fetching comments:', error);
          }
          pan.setValue({ x: 0, y: 0 }); // Reset pan position to (0, 0)
        } else {
          // Snap back to original position if not enough drag
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Animated.View style={[pan.getLayout(), styles.box]} {...panResponder.panHandlers}>
      <Text style={styles.text}>{item._id}</Text>
      <Text style={styles.text}>{item.post}</Text>
    </Animated.View>
  );
};

const Posts = ({ navigation, route }) => {
  const [posts, setPosts] = useState([]);
  const { categoryId } = route.params; // Get categoryId from navigation params

  const loadPosts = async (id) => {
    try {
      const postData = await getPosts(id);
      setPosts(postData);
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  const openCreatePostScreen = () => {
    navigation.navigate('CreatePost', { categoryId }); // Navigoi CreatePost-sivulle
  };
  
useFocusEffect(
    useCallback(() => {
      loadPosts(categoryId); // Fetch posts whenever the screen comes back into focus
    }, [categoryId])
  );

  const backButton = () => {
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={backButton}>
          <Text style={styles.backButton}>{'\u2190'}</Text>
        </TouchableOpacity>
        <Text style={styles.h2}>Category 1</Text>
      </View>
      <View style={styles.horizontalLine} />
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <PostItem item={item} navigation={navigation} />}
      />
      {/* postauksen lisääminen */}
      <TouchableOpacity style={styles.createPostButton} onPress={openCreatePostScreen}>
        <Text style={styles.createPostButtonText}>+ Create New Post</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#242424"
  },
  headerContainer: {
    flexDirection: 'row', // Aligns arrow and text horizontally
    alignItems: 'center', // Vertically center the arrow and text
    padding: 10,
    marginLeft: 10,
  },
  h2: {
    color: "white",
    fontSize: 28,
    marginLeft: 15 // Add space between the arrow and the text
  },
  horizontalLine: {
    borderBottomColor: '#6F6F6F',
    borderBottomWidth: 1,
    marginBottom: 20,
    width: "90%",
    alignSelf: 'center'
  },
  box: {
    minHeight: 130,
    width: 350,
    marginBottom: 10,
    backgroundColor: "#181818",
    alignSelf: "flex-end",
  },
  text: {
    color: "white",
    padding: 15
  },
  backButton: {
    color: "white",
    fontSize: 32,
    marginBottom: 10,
  },
  createPostButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  createPostButtonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  }
});


export default Posts;

