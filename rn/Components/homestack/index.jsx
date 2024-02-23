import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../home';
import Notes from '../notes';
import Users from '../admin/allUsers';
import AllNotes from '../admin/allNotes';
const Stack = createNativeStackNavigator();

const Homestack = (/* props */) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="home"
        component={Home}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="notes"
        component={Notes}
        options={{headerShown: true, title: 'Notes'}}
      />
      <Stack.Screen
        name="allusers"
        component={Users}
        options={{headerShown: true, title: 'All users'}}
      />
      <Stack.Screen
        name="allnotes"
        component={AllNotes}
        options={{headerShown: true, title: 'All notes'}}
      />
    </Stack.Navigator>
  );
};

export default Homestack;
