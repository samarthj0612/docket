import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './Components/login';
import Signup from './Components/signup';
import Homestack from './Components/homestack';
import {UserProvider} from './context/UserContext';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="signup"
          screenOptions={{headerShown: false}}>
          <Stack.Screen name="login" component={Login} />
          <Stack.Screen name="signup" component={Signup} />
          <Stack.Screen name="homestack" component={Homestack} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
};

export default AppNavigator;
