import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';


export default function Signup({navigation}) { 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const auth = getAuth();

    const handleSignup = async () => { // functio jolla käsitellään rekisteröitymistä
        try {
          await createUserWithEmailAndPassword(auth, email, password); //kutsutaan Firebase Authenticationin createUserWithEmailAndPassword, jolla asetetaan käyttäjän tiedot
          console.log('User signed up');
          navigation.navigate('Login'); //siirrytään rekesteröitymisen jälkeen Login-komponenttiin
        } catch (error) {
          console.error('Error signing up:', error);
        }
      };
    
      return (
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry // kun kentän arvo on true, tällä piilotetaan salasanan syöttäminen ja tilalle laitetaan tähtiä ****
            
          />
          <Button title="Sign Up" onPress={handleSignup} />
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        padding: 20,
      },
      input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 8,
      },
    });
