import React from 'react';
import {Modal, Text, View} from 'react-native';
import {styles} from './Styles';
import { Paragraph, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { deleteObservation} from './firebase';


const ShowObservation = ({visible, observation, onClose }) => {
    const navigation = useNavigation();

if(!observation) return null; //tarkastetaan onko observation määritelty

const handleDeleteObservation = async () => {
    try {
        if (typeof observation.id !== 'string') {
            console.error('Observation ID must be a string');
            return;
        }
        await deleteObservation(observation.id); // Kutsutaan oikeaa funktiota
        onClose();  // Suljetaan modal, jos poisto onnistuu
    } catch (e) {
        console.error('Virhe poistaessa havaintoa:', e);
    }
};


return (
<Modal visible={visible} transparent={true} animationType="slide">
    <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
            <Paragraph>Havainto:</Paragraph> 
            <Text style={styles.descriptionText}>Havainto: {observation.name}</Text>
            <Paragraph>Ikoni:</Paragraph> 
            <Text style={styles.descriptionText}>{observation.icon}</Text>
            <Paragraph>Kuvaus:</Paragraph>
            <Text style={styles.descriptionText}> {observation.folder}</Text>
            <Paragraph>Koordinaatit:</Paragraph>
            <Text style={styles.descriptionText}>{observation.latitude}, {observation.longitude}</Text>

            <Button
                mode="text"
                onPress={() => { 
                navigation.navigate('EditObservation', {observation});
                }}
                >
                Muokkaa
                </Button>
            <Button mode="outlined" onPress={handleDeleteObservation}>
                Poista
            </Button>
            <Button mode="text" onPress={onClose}>
                Sulje
            </Button>
            </View>  
    </View>
</Modal>
);
};

export default ShowObservation;


