// App.js

// React and react-native imports 
import React from "react";
import { NavigationContainer } from '@react-navigation/native';


// Stack navigation installations:
// npm install @react-navigation/native @react-navigation/native-stack
// npm install react-native-screens react-native-safe-area-context 
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';

// All screens imported to this main App.js file
import LogIn from './Screens/LogInScreen';
import Home from './Screens/HomeScreen';
import Posts from './Screens/PostsScreen';
import Comments from './Screens/CommentsScreen';
import CreatePost from './Screens/CreatePost';

enableScreens();

const Stack = createNativeStackNavigator();

const App = () => {
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LogIn"> {/* Starting screen */}
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
  );
}

export default App;
