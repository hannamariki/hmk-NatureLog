import React, { useState } from 'react';
import { TextInput, Button, Paragraph, TouchableRipple, IconButton } from 'react-native-paper';
import { View, StyleSheet, Text, Modal } from 'react-native';
import { saveObservation } from './firebase';

// Ikonivaihtoehdot https://unicode.org/emoji/charts/full-emoji-list.html#1face
const iconOptions = [
  { label: 'Lintu', value: '🦆' },
  { label: 'Jänis', value: '🐇' },
  { label: 'Villisika', value: '🐗' },
  { label: 'Kettu', value: '🦊' },
  {labl: 'Susi', value: '🐺'},
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



const AddObservation = ({ onSave, onClose, isVisible, latitude, longitude, route }) => {
  const [name, setName] = useState('');  // Havainnon nimi
  const [icon, setIcon] = useState('Lisää kuvake'); // Oletusikoni (eläimen jälki)
  const [description, setDescription] = useState('');  // Kuvaus
  const [iconModalVisible, setIconModalVisible] = useState(false); // Ikonilistan ikkunavalikko
  const [descriptionModalVisible, setDescriptionModalVisible] = useState(false);
  const [folder, setFolder] = useState(''); // Kansio
  const [folderModalVisible, setFolderModalVisible] = useState(false);
  const [newFolder, setNewFolder] = useState('');
  const [existingFolders, setExistingFolders] = useState(['']);
  const {observation} = route.params || {};

  const handleSave = async () => {
    if (!latitude || !longitude) {
      Alert.alert('Virhe', 'Koordinaatit puuttuvat');
      return;
    }

    const observation = { 
      name,
      icon : icon || '⭕', 
      description, 
      folder, 
      latitude, 
      longitude };

    try{
      await saveObservation(observation);
      console.log("Observation saved")
      onSave(observation);  // Kutsutaan onSave-funktiota (Map.js-komponentista)
      onClose();
    }catch (e) {
      console.error("Error saving observation: ", e);
    }
    
    setIconModalVisible(false); // Sulje kuvakkeen valinta
    setDescriptionModalVisible(false);
    setFolderModalVisible(false); 
  };

  const handleFolder = () => {
    if (newFolder){
      existingFolders.push(newFolder);
      setFolder(newFolder);
      setNewFolder('');
      setFolderModalVisible(false); //suljetaan kansio

    }
  }

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

          {/* Kansiolle nimi */}
          <Paragraph >
          <IconButton 
              icon="folder" 
              size={20} 
              onPress={() => setFolderModalVisible(true)} 
            />
            Kansio </Paragraph>
          <TouchableRipple style={styles.iconButton} onPress={() => setFolderModalVisible(true)}>
          <Text style={styles.descriptionText}>{folder || 'Valitse kansio'}</Text>
          </TouchableRipple>

          {/*Koordinaatit */}
          <Paragraph style={styles.paragraph}>
             <IconButton 
              icon="map-marker"
              size={20}
              onPress={() => setFolderModalVisible(true)} 
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
                    setIconModalVisible(false); // Sulkee valintaikkunan kun ikoni on valittu
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
                    Tallenna
                    </Button>
                  <Button mode="text" onPress={() => setDescriptionModalVisible(false)}>
                    Peruuta
                </Button>
              </View>
            </View>
        </Modal>
     

        {/* Kansion valintaikkuna */}
      <Modal visible={folderModalVisible} transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.iconModalContent}>
          <Text style={styles.modalHeader}>Valitse kansio</Text>

          {/* Olemassa olevat kansiot */}
          <View style={styles.iconList}>
            {existingFolders.map((folderName, index) => (
              <TouchableRipple
                key={index}
                style={styles.iconItem}
                onPress={() => {
                  setFolder(folderName); // Asetetaan valittu kansio
                  setFolderModalVisible(false); // Suljetaan valintaikkuna
                }}
              >
                <Text style={styles.icon}>{folderName}</Text>
              </TouchableRipple>
            ))}
          </View>

           {/* Uuden kansion luominen */}
           <TextInput
              label="Uusi kansio"
              value={newFolder}
              onChangeText={setNewFolder}
              style={styles.input}
            />
            <Button mode="contained" onPress={handleFolder}>
              Luo kansio
            </Button>

            <Button mode = "text" onPress={() => setFolderModalVisible(false)}>
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
    fontSize: 14,
    marginBottom: 30,
  },
  icon: {
    fontSize: 27
    ,
  },
  iconButton: {
    marginTop: 5,
    padding: 10,
  },
  iconList: {
    flexDirection: 'row',  
    flexWrap: 'wrap',     
    justifyContent: 'space-around', 
  },
  iconItem: {
    margin: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconModalContent: {
    backgroundColor: '#fff',
    padding: 10,
    width: '80%',
    borderRadius: 10,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'center',
  },
  descriptionInput: {
    height: 120, 
    fontSize: 14,
    marginBottom: 20,
  },
  descriptionText:{
    fontSize: 14,
    marginBottom: 30,
    color: '#808080',
  },
  paragraph:{
    marginBottom: 20,
  }
  

});

export default AddObservation;
