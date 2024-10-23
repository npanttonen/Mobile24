import React, { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import CheckBox from '@react-native-community/checkbox'; // Import CheckBox
import { login } from "./components/serverReguests";
import { useAuth } from './components/AuthContext';
import { init, addUser, FetchUser } from './components/db'; // Import database functions

const LogIn = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false); // State for "Remember Me"
    const { setToken } = useAuth(); // Use the Auth context to set token

    // Fetch user details from SQLite if available and rememberMe is true
    useEffect(() => {
        init()
            .then(() => {
                console.log('Database initialized successfully!');
            })
            .catch((err) => {
                console.log('Database initialization failed: ' + err);
            });

        const fetchUserData = async () => {
            try {
                const users = await FetchUser(); // Fetch user data from SQLite
                if (users.length > 0) {
                    const user = users[0]; // Assume only one user is stored
                    if (user.rememberMe === 1) {
                        setUsername(user.username);
                        setPassword(user.password);
                        setRememberMe(true); // Set the checkbox to checked if user chose to remember
                    }
                }
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };

        fetchUserData();
    }, []); // Empty dependency array ensures this runs once when component mounts

    const handleLogin = async () => {
        try {
            // Login and get token from serverReguests
            const token = await login(username, password);
            console.log('Authenticated, token:', token);
            setToken(token);

            // Check if "Remember Me" is selected and save user info to database
            if (rememberMe === true) {
                await addUser(username, password, 1); // Store username, password, and rememberMe flag
            } else {
                await addUser(username, "", 0); // Clear the password if rememberMe is not selected
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
