import React, { Component, useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import { login } from "./components/serverReguests"
import { useAuth } from './components/AuthContext';

const LogIn = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { savedtoken, setToken } = useAuth(); // Use the Auth context
    const handleLogin = async () => {
        try {
            //login and get token from serverReguests-login
            const token = await login(username, password);
            
            console.log('Authenticated, token:', token);
            setToken(token)
            //go to homescreen 
            navigation.navigate("Home");
        } catch (error) {
          // Handle errors here
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
  Button: {
    backgroundColor: "white",
    height: 40,
    borderRadius: 5,
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
