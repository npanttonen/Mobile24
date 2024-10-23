import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import { useAuth } from './components/AuthContext'; // Import the useAuth hook
import { getCategories } from "./components/serverReguests";
import { FetchUser, fetchSavedPost } from "./components/db";

const Home = ({ navigation }) => {
    const { savedtoken } = useAuth(); // Access setToken from Auth context
    const [categories, setCategories] = useState([]);
    const [savedpost, savepost] = useState('');
    const [savedCategory, setSavedCategory] = useState('');

    const getSavedPost = async () => {
        try {
            const users = await FetchUser(); // Fetch the user from the database

            if (users.length === 0) {
                alert('No user found to save the post!');
                return;
            }

            const username = users[0].username;
            const savedpostArray = await fetchSavedPost(username); // fetch saved post

            if (savedpostArray.length > 0) {
                setSavedCategory(savedpostArray[0].category);
                savepost(savedpostArray[0].savedPost);
            } else {
                console.log('No saved posts found for this user.');
            }
        } catch (error) {
            console.error('Error fetching saved post:', error);
            alert('Error fetching saved post. Please try again.');
        }
    };

    const loadCategories = async () => {
        try {
            const categorydata = await getCategories(savedtoken);
            console.log(categorydata);
            setCategories(categorydata);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    // Use useFocusEffect to load categories and saved posts when the screen is focused
    useFocusEffect(
        React.useCallback(() => {
            loadCategories();
            getSavedPost();

            // Optionally, you can return a cleanup function if needed
            return () => {
                // Clean up if needed
            };
        }, [savedtoken]) // Dependencies can be added here as needed
    );

    const goToCategory = (categoryId) => {
        navigation.navigate("Posts", { categoryId }); // Pass the categoryId as a parameter
    };

    const LogOut = () => {
        navigation.navigate("LogIn");
    };

    const continueCreatingPost = () => {
      navigation.navigate('CreatePost', { savedCategory, shouldLoadSavedPost: true });
  }
  

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
        <Text style={styles.h1}>Saved post</Text>
        <View style={styles.horizontalLine} />

        {savedpost ? (
            <TouchableOpacity 
                style={styles.savedpost} 
                onPress={continueCreatingPost}
            >
                <Text style={styles.text}>{savedCategory}</Text>
                <Text style={styles.text}>{savedpost}</Text>
            </TouchableOpacity>
        ) : (
            <Text style={styles.text}>No saved post</Text>
        )}

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
    LogOutButtonText: {
        color: "white",
        fontSize: 20
    },
    savedpost: {
        minHeight: 130,
        width: 350,
        marginBottom: 10,
        backgroundColor: "#181818",
        alignSelf: "center",
    },
    text: {
        color: "white",
        padding: 15
    },
});

export default Home;
