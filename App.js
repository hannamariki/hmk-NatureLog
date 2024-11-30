import React from 'react';
import { NavigationContainer } from '@react-navigation/native'; 
import { createStackNavigator } from '@react-navigation/stack'; 



import Map from './components/Map';



const Stack = createStackNavigator(); 

const App = () => {

  return (
    <NavigationContainer>  
      <Stack.Navigator initialRouteName="Map">
        <Stack.Screen name="Map" component={Map} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;