// Home screen 

// React and react-native imports 
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useFocusEffect } from '@react-navigation/native'; 

// Database and server reguest function imported from the components folder
import { getCategories } from "./components/serverReguests";
import { FetchUser, fetchSavedPost, deleteUser } from "./components/db"; 

// Home main function
const Home = ({ navigation }) => {
    const [savedtoken, setToken] = useState(''); // State to hold saved token
    const [categories, setCategories] = useState([]); // State for categories
    const [savedpost, setSavedPost] = useState(''); // State for saved post
    const [savedCategoryId, setsavedCategoryId] = useState(''); // State for saved category ID

    // Fetch saved post from the database
    const getSavedPost = async () => {
        try {
            const users = await FetchUser(); // Fetch the user from the database

            // Check if any user exists
            if (users.length === 0) {
                alert('No user found to save the post!'); // Alert if no user found
                return;
            }

            const username = users[0].username; // Get username from fetched user
            const savedpostArray = await fetchSavedPost(username); // Fetch saved post for the user
            console.log(savedpostArray)
            // Check if any saved posts were found
            
            if (savedpostArray.length > 0) {
                console.log(savedpostArray[0].category); // Log category of the first saved post
                setsavedCategoryId(savedpostArray[0].category); // Set saved category ID
                setSavedPost(savedpostArray[0].savedPost); // Set saved post
            } else {
                console.log('No saved posts found for this user.'); // Log if no saved posts found
            }
        } catch (error) {
            console.error('Error fetching saved post:', error); // Log any error
            alert('Error fetching saved post. Please try again.'); // Alert user of error
        }
    };

    // Load categories from the server
    const loadCategories = async () => {
        try {
            const users = await FetchUser(); // Fetch the user from the database

            // Check if any user exists
            if (users.length === 0) {
                alert('No user found to save the post!'); // Alert if no user found
                return;
            }
            const token = users[0].token; // Get token from fetched user
            const categorydata = await getCategories(token); // Fetch categories using the token
            setCategories(categorydata); // Set fetched categories
        } catch (error) {
            console.error('Error loading categories:', error); // Log any error
        }
    };

    // Use useFocusEffect to load categories and saved posts when the screen is focused
    useFocusEffect(
        React.useCallback(() => {
            loadCategories(); 
            getSavedPost(); 
        }, []) // Empty array ensures this runs only when the screen is focused
    );

    // Navigate to category screen
    const goToCategory = (categoryId, categoryName) => {
        navigation.navigate("Posts", { categoryId, categoryName }); // Pass category ID and name to the Posts screen
    };

    // Log out function
    const LogOut = async () => {
        try {
            const users = await FetchUser(); // Fetch the user from the database

            // Check if "Remember Me" is not selected
            if (users[0].rememberMe === 0) {
                await deleteUser(); // Delete user data
            }
            navigation.navigate("LogIn"); // Navigate to Login screen
        } catch (error) {
            console.error('Error deleting user:', error); 
        }
    };

    // Continue creating post function
    const continueCreatingPost = () => {
        navigation.navigate('CreatePost', { 
            categoryId: savedCategoryId,     // Pass savedCategoryId as the CategoryId
            shouldLoadSavedPost: true      // Set this flag to true to load the saved post
        });
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
                        onPress={() => goToCategory(item.categoryID, item.categoryName)} // Pass the CategoryId on press
                    >
                        <Text style={styles.categoryText}>{item.categoryName}</Text>
                    </TouchableOpacity>
                )}
            />
            <Text style={styles.h1}>Saved post</Text>
            <View style={styles.horizontalLine} />

            {/* If we have saved post make a button to continue making it */}
            {savedpost ? (
                <TouchableOpacity
                    style={styles.savedpost}
                    onPress={continueCreatingPost}
                >
                    {categories.length > 0 && savedCategoryId ? (
                        <Text style={styles.text}>
                            {categories[parseInt(savedCategoryId) - 1]?.categoryName || 'Category not found'}
                        </Text>
                    ) : (
                        <Text style={styles.text}>Loading category...</Text>
                    )}
                    <Text style={styles.text}>{savedpost}</Text>
                </TouchableOpacity>
            ) : (
                <Text style={styles.text}>No saved post</Text> // If no saved post display this text
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
