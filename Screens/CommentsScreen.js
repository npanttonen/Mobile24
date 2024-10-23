import React, { useRef, useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Animated, PanResponder, TouchableOpacity, TextInput } from "react-native";
import { createComment, getAllPostComments } from './components/serverReguests';


// InPostView component handles the post and comments display with swipe gesture
const InPostView = ({ commentdata, postdata, navigation }) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy); // Only respond to horizontal gestures
      },
      onPanResponderMove: (e, gestureState) => {
        // Only track rightward drag
        if (gestureState.dx > 0) {
          pan.setValue({ x: gestureState.dx, y: 0 });
        }
      },
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dx > 150) {
          // If dragged right enough (threshold of 150), navigate back
          navigation.goBack();
        } else {
          // Reset position if not dragged enough
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false
          }).start();
        }
      }
    })
  ).current;

  return (
    <Animated.View
      style={[pan.getLayout(), styles.container]} // Apply drag layout to the view
      {...panResponder.panHandlers} // Attach the PanResponder
    >
      <Text style={styles.text}>{postdata.time}</Text>
      <Text style={styles.text}>{postdata.post}</Text>
      <View style={styles.horizontalLine} />
      <FlatList
        contentContainerStyle={{
          paddingTop: 20,
          paddingLeft: 40,
        }}
        data={commentdata}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.commentBox}>
            <Text style={styles.commentText}>{item.time}</Text>
            <Text style={styles.commentText}>{item.post}</Text>
          </View>
        )}
      />
    </Animated.View>
  );
};

// Comments component retrieves the post and comments data from navigation route
const Comments = ({ route, navigation }) => {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");


  // Use useEffect to set post and comments from route.params
  useEffect(() => {
    if (route.params) {
      const { post, comments } = route.params; // Retrieve post and comments from params
      setPost(post);
      setComments(comments);
    }
  }, [route.params]);

  //kommentin käsittely
  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      const createdComment = createComment(newComment, post._id);
      if (createdComment) {
        setComments(prevComments => [
          ...prevComments,
          { _id: createdComment._id, post: newComment, time: new Date().toLocaleString() }
        ]);
        setNewComment(""); // Tyhjentää syöttökentän
      }

    } else {
        alert("Please enter a comment!"); // Varoitus tyhjälle kentälle
    }
};


  if (!post) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <InPostView
        postdata={post}
        commentdata={comments}
        navigation={navigation}
      />

      {/* inputökenttä kommentille */}
      <TextInput
        style={styles.input}
        placeholder="Write a comment..."
        placeholderTextColor="#888"
        value={newComment}
        onChangeText={setNewComment} // Päivittää tilan
      />

      {/* submit */}
      <TouchableOpacity style={styles.button} onPress={handleCommentSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  horizontalLine: {
    borderBottomColor: '#6F6F6F',
    borderBottomWidth: 1,
    marginVertical: 5,
    width: "90%",
    alignSelf: 'center'
  },
  commentBox: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#333",
    borderRadius: 8,
  },
  commentText: {
    color: "white",

  },
  container: {
    flex: 1,
    backgroundColor: "#242424",
    justifyContent: "space-between", // Tämä pitää sisällön erillään ja asettaa painikkeen alas
  },
  text: {
    color: "white",
    padding: 15,
    fontSize: 20,
  },
  button: {
    backgroundColor: '#007BFF', // Blue button
    padding: 15,
    borderRadius: 10,
    alignSelf: 'center', // Center button horizontally
},
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  input: {
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 10,
    color: "white",
    marginBottom: 10, // Space between input field and button
},

});

export default Comments;
