import React, { useState } from "react";
import { FlatList, View, StyleSheet, StatusBar, Text, TextInput, TouchableOpacity} from "react-native";
import PostsView from "./components/PostsView";
import InPostView from "./components/InPostView";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';

enableScreens();

const Stack = createNativeStackNavigator();

const App=()=>{
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LogIn">
        <Stack.Screen 
          name="LogIn" 
          component={LogIn} 
          options={{ headerShown: false }} // Hide the header for LogIn screen
        />
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{ headerShown: false }} // Hide the header for Home screen
        />
        <Stack.Screen 
          name="Posts" 
          component={Posts} 
          options={{ headerShown: false }} // Hide the header for Posts screen
        />
        <Stack.Screen 
          name="Comments" 
          component={Comments} 
          options={{ headerShown: false }} // Hide the header for Comments screen
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const LogIn = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <View style={styles.Formcontainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="white"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          placeholderTextColor="white"
        />

          <TouchableOpacity style={styles.Button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
      </View>
    </View>
  );
};

const Home = ({navigation}) => {
  const [categories, setCategories] = useState([
    { categoryId: "66fe886789l3b639bdba51df", categoryname: "Category1" },
    { categoryId: "66fe886789l3b6d39bba51df", categoryname: "category2" },
    { categoryId: "66fe886789l3b639bdna51df", categoryname: "category3" },
    { categoryId: "66fe886789l3b6397dba51df", categoryname: "category5" },
    { categoryId: "66fe886789l3b6397dba51df", categoryname: "category6" },
  ]);

  const goToCategory = () => {
    navigation.navigate("Posts");
  };

  const LogOut = () => {
    navigation.navigate("LogIn");
  };

  return (
  <View style={styles.container}>
    <Text style={styles.h1}>Home Screen</Text>
    <View style={styles.horizontalLine} />
    <FlatList
        contentContainerStyle={{
          paddingTop: 20,
          paddingLeft: 40,
        }}
        numColumns={2} 
        data={categories}
        keyExtractor={(item) => item.categoryId}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.CategoryButton} onPress={goToCategory}>
            <Text style={styles.categoryText}>{item.categoryname}</Text>
          </TouchableOpacity>
        )}
        
      />
    <TouchableOpacity style={styles.LogOutButton} onPress={LogOut}>
      <Text style={styles.LogOutButtonText}>LOGOUT</Text>
    </TouchableOpacity>
  </View>
  )
};

const Posts = ({navigation})  => {
  const [posts, setPosts] = useState([
    { _id: "66fe883c89e3b639bdba51dd", time: "2024-10-03T12:04:12.109Z", post: "Only 5 days left to register to vote in Georgia! Make sure to share this with your friends and family in Georgia. This election is the most important in living memory. Register online in a few minutes via link below:" },
    { _id: "66fe886289e3b639bdba51de", time: "2024-10-03T12:04:50.056Z", post: "testi12" },
    { _id: "66fe886789d3b639bdba51df", time: "2024-10-03T12:04:55.061Z", post: "testi123" },
    { _id: "66fe886789g3b639bdba51df", time: "2024-10-03T12:04:55.061Z", post: "testi123" },
    { _id: "66fe886789mk3b639bdba51df", time: "2024-10-03T12:04:55.061Z", post: "testi123" },
    { _id: "66fe886789k3b639bdba51df", time: "2024-10-03T12:04:55.061Z", post: "testi123" },
    { _id: "66fe886789l3b639bdba51df", time: "2024-10-03T12:04:55.061Z", post: "testi123" }
  ]);

  const [scrollEnabled, setScrollEnabled] = useState(true);


  return (
    <View style={styles.container}>
      <Text style={styles.h2}>Category 1</Text>
      <View style={styles.horizontalLine} />
      <FlatList
        contentContainerStyle={{
          paddingTop: 20,
          paddingLeft: 40,
        }}
        data={posts}
        scrollEnabled={scrollEnabled} // Control scrolling here
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <PostsView
            data={item}
            id={item._id}
            setScrollEnabled={setScrollEnabled} // Pass the callback to control scrolling
            navigation={navigation}
          />
        )}
      />
    </View>
  );
};
const Comments = ({navigation}) => {
  const [post, setPost] = useState({ _id: "66fe883c89e3b639bdba51dd", time: "2024-10-03T12:04:12.109Z", post: "Only 5 days left to register to vote in Georgia! Make sure to share this with your friends and family in Georgia. This election is the most important in living memory. Register online in a few minutes via link below:" });
  const [comments, setComment] = useState([
    { _id: "66fe886289e3b639bdba51de", time: "2024-10-03T12:04:50.056Z", comment: "comments" },
    { _id: "66fe886789d3b639bdba51df", time: "2024-10-03T12:04:55.061Z", comment: "comments" },
    { _id: "66fe886789g3b639bdba51df", time: "2024-10-03T12:04:55.061Z", comment: "comments" },
    { _id: "66fe886789mk3b639bdba51df", time: "2024-10-03T12:04:55.061Z", comment: "comments" },
    { _id: "66fe886789k3b639bdba51df", time: "2024-10-03T12:04:55.061Z", comment: "comments" },
    { _id: "66fe886789l3b639bdba51df", time: "2024-10-03T12:04:55.061Z", comment: "comments" }
  ]);

  const [scrollEnabled, setScrollEnabled] = useState(true);

  return (
    <View style={styles.container}>
      <InPostView
        postdata={post}
        commentdata={comments}
        setScrollEnabled={setScrollEnabled}
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
  Formcontainer: {
    height: "60%",
    width: "80%",
    marginTop: "20%", 
    backgroundColor: "black",
    alignSelf: "center",
    justifyContent: 'center', 
    borderRadius: 20
  },
  h2: {
    padding: 10,
    color: "white",
    fontSize: 28,
    marginLeft: 20
  },
  h1: {
    padding: 10,
    color: "white",
    fontSize: 28,
    marginLeft: 20
  },
  horizontalLine: {
    borderBottomColor: '#6F6F6F', // Line color
    borderBottomWidth: 1, // Line thickness
    marginVertical: 5, // Spacing above and below the line
    width: "90%",
    alignSelf: 'center'
  },
  input: {
    backgroundColor: "#181818",
    height: 50,
    width: 200,
    borderColor: '#6F6F6F',
    borderWidth: 1,
    marginBottom: 30,
    padding: 10,
    alignSelf: "center",
    textAlign:"center",
    borderRadius: 20,
    color: "white"
  },
  Button: {
    backgroundColor: "white", // Custom background color
    height: 40,
    borderRadius: 5, // Optional: rounded corners
    justifyContent: "center",
    alignItems: "center",
    width: "40%",
    alignSelf: "center",
    borderRadius: 20
    
  },
  buttonText: {
    color: "black", // Text color
    fontSize: 16,
  },
  CategoryButton: {
    backgroundColor: "#2E512C",
    height: 50,
    width: 150,
    padding: 5,
    marginRight: 10,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  categoryText: {
    color: "white", // Text color
    fontSize: 16,
  },
  LogOutButton: {
    backgroundColor: "#750101",
    
    borderWidth: 2,
    borderColor: "red",
    height: 60,
    width: 150,
    padding: 5,
    marginBottom: 20,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20
  },
  LogOutButtonText: {
    color: "white", // Text color
    fontSize: 20,
  },
});

export default App;
