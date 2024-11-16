import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native'; 
import { createStackNavigator } from '@react-navigation/stack'; 
import { onAuthStateChanged } from 'firebase/auth'; 
import { auth } from './components/firebase';

import Login from './components/Login';
import Signup from './components/Signup';
import Map from './components/Map';
import AddObservation from './components/AddObservation';


const Stack = createStackNavigator(); 

const App = () => {
  const [user, setUser] = useState(null);  // Käyttäjän tilan hallinta
  

  useEffect(() => {
    // Tarkistetaan, onko käyttäjä kirjautunut
    const unsubscribe = onAuthStateChanged(auth, (user) => { //firebase Authenticationin kuuntelija, joka odottaa käyttäjän tilan muutoksia (sisään/uloskirjautuminen)
      if (user) {
        setUser(user);  // Käyttäjä on kirjautunut sisään, asetetaan user tilaan käyttäjän tiedot
      } else {
        setUser(null);  // Käyttäjä ei ole kirjautunut
      }
    });

    // Poistetaan kuuntelija, jotta se ei jää aktiiviseksi taustalle
    return () => unsubscribe();
  }, []); //tyhjä lista, kirjautuminen tarkastetaan vain kerran 

  return (
    <NavigationContainer>  
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Map" component={Map} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;