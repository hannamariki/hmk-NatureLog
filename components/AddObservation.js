import React, { useState } from 'react';
import { TextInput, Button, Paragraph } from 'react-native-paper';
import { View, StyleSheet, Text, Modal, TouchableOpacity } from 'react-native';

const iconOptions = [
  { label: 'Lintu', value: '🦆' },
  { label: 'Jänis', value: '🐇' },
  { label: 'Villisika', value: '🐗' },
  { label: 'Kettu', value: '🦊' },
  { label: 'Karhu', value: '🐻' },
  { label: 'Mäyrä', value: '🦡' },
  { label: 'Hirvi', value: '🫎' },
  { label: 'Hirvieläin', value: '🦌' },
  { label: 'Kala', value: '🐟' },
  { label: 'Sieni', value: '🍄' },
  { label: 'Marja', value: '🫐' },
  { label: 'Eläimen jälki', value: '🐾' },
  { label: 'Muu havainto', value: '⭕' }
];

const AddObservation = ({ onSave, onClose, isVisible }) => {
  const [name, setName] = useState('');  // Havainnon nimi
  const [icon, setIcon] = useState('🐾'); // Alustetaan valittu ikoni
  const [iconModalVisible, setIconModalVisible] = useState(false); // Ikonivalikon näkyvyys

  const handleSave = () => {
    const observation = { name, icon };  // Liitetään myös valittu ikoni havaintoon
    onSave(observation);  // Kutsutaan onSave-funktiota (Map.js komponentista)
  };

  return (
    <Modal visible={isVisible} transparent={true}> {/*Popup ikkuna, transparent={true} tarkoittaa että tausta on läpinäkyvä*/}
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TextInput
            label="Nimi"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <Paragraph>Kuvake</Paragraph>

          {/* Näytetään valittu ikoni */}
          <TouchableOpacity style={styles.iconButton} onPress={() => setIconModalVisible(true)}>
            <Text style={styles.icon}>{icon}</Text> 
          </TouchableOpacity>

          <Button mode="contained" onPress={handleSave}>
            Tallenna
          </Button>
          <Button mode="text" onPress={onClose}>
            Peruuta
          </Button>
        </View>
      </View>

      {/* Ikonimodal, joka avautuu erikseen */}
      <Modal visible={iconModalVisible} transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.iconModalContent}>
            <Text style={styles.modalHeader}>Valitse ikoni</Text>

            {/* Ikonit valinta */}
            {iconOptions.map((iconOption, index) => (
              <TouchableOpacity
                key={index}
                style={styles.iconItem}
                onPress={() => {
                  setIcon(iconOption.value); // Valitaan ikoni
                  setIconModalVisible(false); // Suljetaan modaalin ikoni
                }}
              >
                <Text style={styles.icon}>{iconOption.value}</Text> 
              </TouchableOpacity>
            ))}

            <Button mode="text" onPress={() => setIconModalVisible(false)}>
              Sulje
            </Button>
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Puoli läpinäkyvä tausta
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    width: '80%',
    borderRadius: 10,
    elevation: 5,
  },
  input: {
    marginBottom: 12,
  },
  icon: {
    fontSize: 30,
  },
  iconButton: {
    marginTop: 5,
    padding: 20,
  },
  iconList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  iconItem: {
    margin: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconModalContent: {
    backgroundColor: '#fff',
    padding: 20,
    width: '80%',
    borderRadius: 10,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default AddObservation;
