import React, { useState, useEffect } from 'react';
import { TextInput, Button, Paragraph, TouchableRipple, IconButton } from 'react-native-paper';
import { View, Text, Modal, Alert } from 'react-native';
import { saveObservation} from './firebase';
import {styles} from './Styles';

// Ikonivaihtoehdot https://unicode.org/emoji/charts/full-emoji-list.html#1face
const iconOptions = [
  { label: 'Lintu', value: '🦆' },
  { label: 'Jänis', value: '🐇' },
  { label: 'Villisika', value: '🐗' },
  { label: 'Kettu', value: '🦊' },
  {label: 'Susi', value: '🐺'},
  { label: 'Karhu', value: '🐻' },
  { label: 'Mäyrä', value: '🦡' },
  { label: 'Hirvi', value: '🫎' },
  { label: 'Hirvieläin', value: '🦌' },
  { label: 'Kala', value: '🐟' },
  { label: 'Sieni', value: '🍄' },
  { label: 'Marja', value: '🫐' },
  { label: 'Jälki', value: '🐾' },
  { label: 'Muu havainto', value: '⭕' }
];



const AddObservation = ({ onClose, isVisible, latitude, longitude }) => {
  const [name, setName] = useState('');  
  const [icon, setIcon] = useState('Lisää kuvake'); 
  const [description, setDescription] = useState(''); 
  const [iconModalVisible, setIconModalVisible] = useState(false); // Ikonilistan ikkunavalikko
  const [descriptionModalVisible, setDescriptionModalVisible] = useState(false);


  const handleSave = async () => {
    if (!latitude || !longitude) {
      Alert.alert('Virhe', 'Koordinaatit puuttuvat');
      return;
    }
  
    const observation = {
      name,
      icon: icon || '⭕',
      description,
      latitude,
      longitude,
    };
  
    try {
      await saveObservation(observation);
      onClose();
    } catch (e) {
      console.error("Error saving observation: ", e);
      Alert.alert('Virhe', 'Havaintoa ei voitu tallentaa: ' + e.message);
    }
  
    setIconModalVisible(false); // Sulje kuvakkeen valinta
    setDescriptionModalVisible(false);
  };

  return (
    <Modal visible={isVisible} transparent={true}> 
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TextInput
            label="Nimi"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

           {/* Valitaan ikoni */}
          <Paragraph>
          <IconButton 
              icon="paw" 
              size={20} 
              onPress={() => setIconModalVisible(true)} 
            />
            Kuva</Paragraph>
          <TouchableRipple style={styles.iconButton} onPress={() => setIconModalVisible(true)}>
            <Text style={styles.descriptionText}>{icon}</Text>
          </TouchableRipple>

          {/*Kirjoitetaan havaintoon kuvaus */}
          <Paragraph > 
          <IconButton 
              icon="pencil" 
              size={20} 
              onPress={() => setDescriptionModalVisible(true)} 
            />
        
            Kuvaus </Paragraph>
          <TouchableRipple style={styles.iconButton} onPress={()=> setDescriptionModalVisible(true)}>
            <Text style={styles.descriptionText}>{description || 'Lisää kuvaus'}</Text>
          </TouchableRipple>

          {/*Koordinaatit */}
          <Paragraph style={styles.paragraph}>
             <IconButton 
              icon="map-marker"
              size={20}
              />
            Koordinaatit: {latitude}, {longitude}
          </Paragraph>


          <Button mode="contained" onPress={handleSave}>
            Tallenna
          </Button>
          <Button mode="text" onPress={onClose}>
            Peruuta
          </Button>
        </View>
      </View>

      {/* Ikonien valintaikkuna */}
      <Modal visible={iconModalVisible} transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.iconModalContent}>
            <Text style={styles.modalHeader}>Valitse ikoni</Text>

            {/* Ikonien järjestys*/}
            <View style={styles.iconList}>
              {iconOptions.map((iconOption, index) => (
                <TouchableRipple
                  key={index}
                  style={styles.iconItem}
                  onPress={() => {
                    setIcon(iconOption.value);
                    setIconModalVisible(false); 
                  }}
                >
                  <Text style={styles.icon}>{iconOption.value}</Text>
                </TouchableRipple>
              ))}
            </View>

            <Button mode="text" onPress={() => setIconModalVisible(false)}>
              Sulje
            </Button>
          </View>
        </View>
      </Modal>
    
      {/*Kuvauksen valintaikkuna */}
      <Modal visible={descriptionModalVisible} transparent={true}>
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <TextInput
                  label="Kuvaus"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  style={[styles.descriptionInput]}
                  />
                  <Button mode="contained" onPress={() => setDescriptionModalVisible(false)}>
                    Sulje
                    </Button>
                 
              </View>
            </View>
        </Modal>
    </Modal>

  );
};



export default AddObservation;
