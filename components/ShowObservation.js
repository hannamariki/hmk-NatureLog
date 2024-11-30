import React from 'react';
import {Modal, Text, View} from 'react-native';
import {styles} from './Styles';
import { Paragraph, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';


const ShowObservation = ({visible, observation, onClose}) => {
    const navigation = useNavigation();

if(!observation) return null;

const onDelete = async (observationId) => {
    try {
      await deleteObservation(observationId); 
      console.log('Havainto poistettu');
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
            <Text style={styles.descriptionText}> {observation.description}</Text>
            <Paragraph>Kansio:</Paragraph>
            <Text style={styles.descriptionText}> {observation.folder}</Text>
            <Paragraph>Koordinaatit:</Paragraph>
            <Text style={styles.descriptionText}>{observation.latitude}, {observation.longitude}</Text>

            <Button
                mode="text"
                onPress={() => { 
                navigation.navigate('EditObservation', { id: observation});
                }}
                >
                Muokkaa
                </Button>
            <Button mode="outlined" onPress={() => onDelete(observation.id)}>
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


