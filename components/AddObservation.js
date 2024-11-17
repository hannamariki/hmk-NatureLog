import React, { useState } from 'react';
import { TextInput, Button, Paragraph, TouchableRipple } from 'react-native-paper';
import { View, StyleSheet, Text, Modal } from 'react-native';

// Ikonivaihtoehdot https://unicode.org/emoji/charts/full-emoji-list.html#1face
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
  { label: 'Jälki', value: '🐾' },
  { label: 'Muu havainto', value: '⭕' }
];


const AddObservation = ({ onSave, onClose, isVisible }) => {
  const [name, setName] = useState('');  // Havainnon nimi
  const [icon, setIcon] = useState('🐾'); // Oletusikoni (eläimen jälki)
  const [description, setDescription] = useState('');  // Kuvaus
  const [iconModalVisible, setIconModalVisible] = useState(false); // Ikonilistan ikkunavalikko
  const [descriptionModalVisible, setDescriptionModalVisible] = useState(false);
  const [folder, setFolder] = useState(''); // Kansio
  const [folderModalVisible, setFolderModalVisible] = useState(false);
  const [newFolder, setNewFolder] = useState('');

  const handleSave = () => {
    const observation = { name, icon, description };
    onSave(observation);  // Kutsutaan onSave-funktiota (Map.js-komponentista)
    setIconModalVisible(false); // Sulje kuvakkeen valinta
    setDescriptionModalVisible(false);
    setFolderModalVisible(false); 
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
          <Paragraph>Kuvake</Paragraph>
          <TouchableRipple style={styles.iconButton} onPress={() => setIconModalVisible(true)}>
            <Text style={styles.icon}>{icon}</Text>
          </TouchableRipple>

          {/*Kirjoitetaan havaintoon kuvaus */}
          <Paragraph> Kuvaus </Paragraph>
          <TouchableRipple style={styles.iconButton} onPress={()=> setDescriptionModalVisible(true)}>
            <Text style={styles.descriptionText}>{description || 'Lisää kuvaus'}</Text>
          </TouchableRipple>

          {/* Kansiolle nimi */}
          <Paragraph>Kansio </Paragraph>
          <TouchableRipple style={styles.iconButton} onPress={() => setFolderModalVisible(true)}>
          <Text style={styles.icon}>{folder || 'Kansion valinta'}</Text>
          </TouchableRipple>


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
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconModalContent: {
    backgroundColor: '#fff',
    padding: 20,
    width: '80%',
    borderRadius: 10,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  descriptionInput: {
    height: 120, 
    fontSize: 14,
    marginBottom: 12,
  },
  descriptionText:{
    fontSize: 14,
  
  },
});

export default AddObservation;
