import React, { useState, useRef } from "react";
import { FlatList, View, Text, Animated, PanResponder, StyleSheet } from "react-native";

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
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dx < -100) {
            
          navigation.navigate("Comments"); // Navigate to Comments screen
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

const Posts = ({ navigation }) => {
  const [posts] = useState([
    { _id: "66fe883c89e3b639bdba51dd", post: "Sample post 1" },
    { _id: "66fe886789l3b639bdba51df", post: "Sample post 2" },
    // Add other posts here
  ]);

  return (
    <View style={styles.container}>
        
      <Text style={styles.h2}>Category 1</Text>
      <View style={styles.horizontalLine} />
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <PostItem item={item} navigation={navigation} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#242424" },
  h2: { padding: 10, color: "white", fontSize: 28, marginLeft: 20 },
  horizontalLine: {
    borderBottomColor: '#6F6F6F',
    borderBottomWidth: 1,
    marginVertical: 5,
    width: "90%",
    alignSelf: 'center'
  },
  box: {
    minHeight: 130,
    width: 350,
    marginBottom: 10,
    backgroundColor: "#181818",
    alignSelf: "flex-end", // Align the box to the right side of the screen
  },
  text: {
    color: "white",
    padding: 15
  },
});

export default Posts;
