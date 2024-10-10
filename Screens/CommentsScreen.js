import React, { useRef, useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Animated, PanResponder } from "react-native";

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

  // Use useEffect to set post and comments from route.params
  useEffect(() => {
    if (route.params) {
      const { post, comments } = route.params; // Retrieve post and comments from params
      setPost(post);
      setComments(comments);
    }
  }, [route.params]);

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#242424",
  },
  text: {
    color: "white",
    padding: 15,
  },
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
  }
});

export default Comments;
