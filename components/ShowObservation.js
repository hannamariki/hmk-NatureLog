import React from 'react';
import {Modal, Text, View} from 'react-native';
import {styles} from './Styles';
import { Paragraph, Button } from 'react-native-paper';

const EditObservation = ({visible, observation, onClose}) => {
if(!observation) return null;

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
            <Button mode="text" onPress={onClose}>
                Sulje
                </Button>
            </View>  
    </View>
</Modal>
);
};

export default EditObservation;


