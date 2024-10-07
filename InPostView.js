import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, FlatList, Animated, PanResponder } from "react-native";

const InPostView = (props) => {
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
          props.navigation.goBack();
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
      <Text style={styles.text}>{props.postdata.time}</Text>
      <Text style={styles.text}>{props.postdata.post}</Text>
      <View style={styles.horizontalLine} />
      <FlatList
        contentContainerStyle={{
          paddingTop: 20,
          paddingLeft: 40,
        }}
        data={props.commentdata}
        scrollEnabled={props.setScrollEnabled} // Control scrolling here
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.commentBox}>
            <Text style={styles.commentText}>{item.comment}</Text>
          </View>
        )}
      />
    </Animated.View>
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

export default InPostView;
