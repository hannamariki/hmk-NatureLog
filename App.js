import React from 'react';
import { NavigationContainer } from '@react-navigation/native'; 
import { createStackNavigator } from '@react-navigation/stack'; 

import AddObservation from './components/AddObservation'; 
import ShowObservation from './components/ShowObservation'; 
import EditObservation from './components/EditObservation'; 
import Map from './components/Map';



const Stack = createStackNavigator(); 


const App = () => {

  return (

    <NavigationContainer>  
      <Stack.Navigator initialRouteName="Map">
        <Stack.Screen name="Map" component={Map} />
        <Stack.Screen name="AddObservation" component={AddObservation} />
        <Stack.Screen name="ShowObservation" component={ShowObservation} />
        <Stack.Screen name="EditObservation" component={EditObservation} />
      </Stack.Navigator>
    </NavigationContainer>

   

  );
};

export default App;