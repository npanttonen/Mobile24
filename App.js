import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';
import { AuthProvider } from './Screens/components/AuthContext'; // Import the AuthProvider
import LogIn from './Screens/LogInScreen';
import Home from './Screens/HomeScreen';
import Posts from './Screens/PostsScreen';
import Comments from './Screens/CommentsScreen';
import CreatePost from './Screens/CreatePost';

enableScreens();

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    // Wrap NavigationContainer with AuthProvider
    <AuthProvider>
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
          <Stack.Screen 
            name="CreatePost" 
            component={CreatePost} 
            options={{ headerShown: false }} // Hide the header for Comments screen
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;
