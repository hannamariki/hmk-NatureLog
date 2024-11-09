import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';



export default function Login({navigation}) { 

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = getAuth(); //tällä otetaan Firebase Authentication käyttöön

  const handleLogin = async () => { //funktio jolla käsitellään kirjautumista
    try {
      await signInWithEmailAndPassword(auth, email, password); //kutsutaan Firebase Authenticationin signInWithEmailAndPassword-metodia, joka yrittää kirjautua siään sähköpostilla ja salasanalla
      console.log('User signed in');
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const goSignup = () => {
    navigation.navigate('Signup');
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
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      
      <Text style={styles.link} onPress={goSignup}>
        Don't have an account? Sign up
      </Text>
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
  link: {
    marginTop: 10,
    color: 'blue',
  },
});

