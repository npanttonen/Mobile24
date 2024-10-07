import React, { useRef, useState } from "react";
import { Text, Animated, PanResponder, StyleSheet } from "react-native";

const PostsView = (props) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Only respond to horizontal movements
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },
      onPanResponderGrant: () => {
        // No need to reset the Y position to avoid the "jump"
        props.setScrollEnabled(false); // Disable FlatList scrolling when dragging starts
      },
      onPanResponderMove: (e, gestureState) => {
        // Only allow dragging to the left (negative dx) and prevent vertical movement
        if (gestureState.dx < 0) {
          pan.setValue({ x: gestureState.dx, y: 0 }); // Prevent vertical movement
        }
      },
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dx < -100) {
          console.log("test")
          props.navigation.navigate("Comments"); // Navigate to Comments screen
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
        // Reset the position
        Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
        props.setScrollEnabled(true); // Enable FlatList scrolling after drag ends
      },
    })
  ).current;

  return (
    <Animated.View
      style={[pan.getLayout(), styles.box]}
      {...panResponder.panHandlers}
    >
      <Text style={styles.text}>{props.data.time}</Text>
      <Text style={styles.text}>{props.data.post}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
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
  horizontalLine: {
    borderBottomColor: '#6F6F6F', // Line color
    borderBottomWidth: 1, // Line thickness
    marginVertical: 5, // Spacing above and below the line
    width: "90%",
    alignSelf: 'center'
  },
});

export default PostsView;
