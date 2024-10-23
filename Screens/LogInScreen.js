// Log in screen 

// React and react-native imports 
import React, { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";

// Checkbox installation: npm install @react-native-community/checkbox --save
import CheckBox from '@react-native-community/checkbox'; // Import CheckBox

// Database and server reguest function imported from the components folder
import { login } from "./components/serverReguests";
import { init, addUser, FetchUser } from './components/db'; 


// Log in main function
const LogIn = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false); // State for "Remember Me"

    // Initialise database and fetch possible saved userdata from that database when u start app
    useEffect(() => {

        // Database initilalising 
        init()
            .then(() => {
                console.log('Database initialized successfully!');
            })
            .catch((err) => {
                console.log('Database initialization failed: ' + err);
            });

        // fetch the possible saved userdata
        const fetchUserData = async () => {
            try {
                const users = await FetchUser(); // Fetch user data from SQLite
        
                // Check if the result has at least one user
                if (users.length > 0) {
                    const user = users[0]; 
                    
                    // Check the rememberMe property
                    if (user.rememberMe === 1) {
                        setUsername(user.username);  
                        setPassword(user.password);
                        setRememberMe(true); // Set the checkbox to checked if user chose to remember
                    }
                } else {
                    console.log("No user found or user array is empty.");
                }
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };
        

        fetchUserData(); 
    }, []); // Empty dependency array ensures this runs once when component mounts


    // Send login data to server and get auth token and move to home screen 
    const handleLogin = async () => {
        try {
            // Login and get token from serverReguests
            const token = await login(username, password);
            console.log('Authenticated, token:', token);
            

            // Check if "Remember Me" is selected and save user info to database
            if (rememberMe === true) {
                await addUser(username, password, token, 1); // Store username, password, and rememberMe flag
            } else {
                await addUser(username, "", token, 0); // Dont save the password if rememberMe is not selected
            }

            // Navigate to Home screen
            navigation.navigate("Home");
        } catch (error) {
            // Handle login errors
            console.error('Login failed:', error);
        }
    };

    return (
        <View style={styles.container}>
            {/* Log in form */}
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
                <View style={styles.checkboxContainer}>
                    <CheckBox
                        value={rememberMe}
                        onValueChange={setRememberMe}
                        style={styles.checkbox}
                    />
                    <Text style={styles.checkboxLabel}>Remember Me</Text>
                </View>

                {/* Handle login button using TouchableOpacity */}
                <TouchableOpacity style={styles.Button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#242424" },
    Formcontainer: {
        height: "60%",
        width: "80%",
        marginTop: "20%",
        backgroundColor: "black",
        alignSelf: "center",
        justifyContent: 'center',
        borderRadius: 20
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
        textAlign: "center",
        borderRadius: 20,
        color: "white"
    },
    checkboxContainer: {
        flexDirection: "row",
        marginBottom: 30,
        alignSelf: "center",
        alignItems: "center",
    },
    checkbox: {
        alignSelf: "center",
    },
    checkboxLabel: {
        color: "white",
        marginLeft: 10,
    },
    Button: {
        backgroundColor: "white",
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        width: "40%",
        alignSelf: "center",
        borderRadius: 20
    },
    buttonText: {
        color: "black",
        fontSize: 16,
    },
});

export default LogIn;
