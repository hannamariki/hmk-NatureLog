import React, {useState} from 'react';
import { TextInput, Button, } from 'react-native-paper';
import { View, StyleSheet} from 'react-native';


const AddObservation = ({ onSave, onClose }) => {
  const [name, setName] = useState('');  // Havainnon nimi

  const handleSave = () => {
    const observation = { name };
    onSave(observation);  // Kutsutaan onSave-funktiota (Map.js komponentista)
  };

  return (
    <View style={styles.form}>
      <TextInput
        label="Nimi"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      
      <Button mode="contained" onPress={handleSave}>
        Tallenna
      </Button>
      <Button mode="text" onPress={onClose}>
        Peruuta
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    padding: 20,
  },
  input: {
    marginBottom: 12,
  },
});

export default AddObservation;