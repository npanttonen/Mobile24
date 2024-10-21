import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from './components/AuthContext'; // Import the useAuth hook
import { getCategories } from "./components/serverReguests"

const Home = ({ navigation }) => {
    const { savedtoken } = useAuth(); // Access setToken from Auth context
    const [categories, setCategories] = useState(['']);

    const loadCategories = async () => {
        try {
            const categorydata = await getCategories(savedtoken);
            console.log(categorydata)
            setCategories(categorydata);
        } catch (error) {
          // Handle errors here
          console.error('Login failed:', error);r
        }
    };
        useEffect(() => {
            loadCategories();
        }, []); // Empty dependency array ensures this runs only on mount

        const goToCategory = (categoryId) => {
          navigation.navigate("Posts", { categoryId }); // Pass the categoryId as a parameter
        };
        

        const LogOut = () => {
            navigation.navigate("LogIn");
        };
  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Home Screen</Text>
      <View style={styles.horizontalLine} />
      <FlatList
        contentContainerStyle={{ paddingTop: 20, paddingLeft: 40 }}
        numColumns={2}
        data={categories}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.CategoryButton}
            onPress={() => goToCategory(item.categoryID)} // Pass the categoryId on press
          >
            <Text style={styles.categoryText}>{item.categoryName}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.LogOutButton} onPress={LogOut}>
        <Text style={styles.LogOutButtonText}>LOGOUT</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#242424" },
  h1: { padding: 10, color: "white", fontSize: 28, marginLeft: 20 },
  horizontalLine: {
    borderBottomColor: '#6F6F6F',
    borderBottomWidth: 1,
    marginVertical: 5,
    width: "90%",
    alignSelf: 'center'
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
  categoryText: { color: "white", fontSize: 16 },
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
  LogOutButtonText: { color: "white", fontSize: 20 },
});

export default Home;
