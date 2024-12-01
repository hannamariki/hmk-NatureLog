import React, { useState, useEffect } from 'react';
import { TextInput, Button, Paragraph, TouchableRipple, IconButton } from 'react-native-paper';
import { View, Text, Modal } from 'react-native';
import { saveObservation, saveFolder, getFolders } from './firebase';
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



const AddObservation = ({ onSave, onClose, isVisible, latitude, longitude }) => {
  const [name, setName] = useState('');  
  const [icon, setIcon] = useState('Lisää kuvake'); 
  const [description, setDescription] = useState(''); 
  const [iconModalVisible, setIconModalVisible] = useState(false); // Ikonilistan ikkunavalikko
  const [descriptionModalVisible, setDescriptionModalVisible] = useState(false);
  const [folder, setFolder] = useState(''); 
  const [folderModalVisible, setFolderModalVisible] = useState(false);
  const [newFolder, setNewFolder] = useState('');
  const [existingFolders, setExistingFolders] = useState([]);


  const handleSave = async () => {
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        Alert.alert('Virhe', 'Koordinaatit eivät ole kelvollisia');
        return;
    }

    if (!name || typeof name !== 'string' || name.trim() === '') {
      Alert.alert('Virhe', 'Havainnon nimi on pakollinen kenttä.');
      return;
    }

    const observation = {
      name: name || 'Untitled Observation', 
      icon: icon || '⭕',
      description: description || '',
      folder: folder || 'Default',
      latitude: latitude || 0,
      longitude: longitude || 0,
    };

      try {
        console.log("Saving observation under folder:", folder); 
        await saveObservation(folder, observation);
        console.log("Observation saved under folder:", folder);
        onSave(observation);  
        onClose();
      } catch (e) {
        console.error("Error saving observation: ", e);
        Alert.alert('Virhe', 'Havaintoa ei voitu tallentaa: ' + e.message);
      }
    
      console.log("Type of name:", typeof name)
      console.log("Name before saving:", name, typeof name);
      setIconModalVisible(false); // Sulje kuvakkeen valinta
      setDescriptionModalVisible(false);
      setFolderModalVisible(false); 
  };

  
    // Lataa kansiot Firebase-tietokannasta, kun komponentti ladataan
    useEffect(() => {
      const fetchFolders = async () => {
        const folders = await getFolders();
        console.log("Fetched folders:", folders);  
        setExistingFolders(folders);
      };
    
      fetchFolders();
    }, []); // Lataa kansiot vain kerran

  const handleFolder = async () => {
    if (newFolder) {
      if (typeof newFolder !== 'string') {
        console.error("New folder name must be a string");
        return;
      }
      try {
        await saveFolder(newFolder);
        const updatedFolders = [...existingFolders, newFolder];
        setExistingFolders(updatedFolders);
        setFolder(newFolder); 
        setNewFolder('');  
        setFolderModalVisible(false); 
      } catch (e) {
        console.error("Error saving folder: ", e);
    }

    }
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
                if (typeof folderName === 'string') {
                  setFolder(folderName);
                  setFolderModalVisible(false); 
              } else {
                  console.error('Invalid folder name');
              }
              }}
            >
              <Text style={styles.descriptionText}>{folderName}</Text>
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



export default AddObservation;
