import React, { useState, useEffect } from 'react';
import { TextInput, Button, Paragraph, TouchableRipple, IconButton } from 'react-native-paper';
import { View, Text, Modal, Alert } from 'react-native';
import { saveObservation} from './firebase';
import {styles} from './Styles';


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

const EditObservation = ({ navigation, route, isVisible}) => {
    const { observation } = route.params;
    const [name, setName] = useState(observation?.name || '');  
    const [icon, setIcon] = useState(observation?.icon || '⭕'); 
    const [description, setDescription] = useState(observation?.description || '');  
    const [iconModalVisible, setIconModalVisible] = useState(false); 
    const [descriptionModalVisible, setDescriptionModalVisible] = useState(false);
    const latitude = observation?.latitude;
    const longitude = observation?.longitude;
 
    const handleSave = async () => { 
      // Tarkistetaan, että nimi ja ikoni on syötetty
      if (!name || !icon) {
        Alert.alert('Virhe', 'Havaintotiedot ovat puutteelliset');
        return;
      }
    
      // Luodaan päivitysobjekti havainnolle
      const updateObservation = {
        id: observation?.id,
        name,
        icon: icon || '⭕',  // Jos ikonia ei ole valittu, käytetään oletusikonia
        description, 
        latitude, 
        longitude 
      };
    
      // päivitetään havainto
      try {
        await saveObservation(updateObservation); 
        console.log("Havainto tallennettu");
        navigation.navigate('Map');  
      } catch (e) {
        console.error("Virhe havainnon tallentamisessa: ", e);
        Alert.alert('Virhe', 'Havaintoa ei voitu tallentaa');
      }
    };

  return (
    <Modal visible={isVisible} transparent={true}>
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalHeader}>Muokkaa havaintoa</Text>
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
          <Button mode="text" onPress={() => {
            setDescriptionModalVisible(false);
            setIconModalVisible(false);
        
            navigation.navigate('Map');
          }}
            >
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


export default EditObservation;