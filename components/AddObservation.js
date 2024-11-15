import React, { useState } from 'react';
import { Button, View, Text} from 'react-native-paper';
import Modal from 'react-native-modal';


export default function AddObservation ({isModalVisible, toggleModal}){

        return (
            <Modal
            visible={isModalVisible}
            onRequestClose={toggleModal}
            animationType="slide"
          >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text>Add your observation</Text>
              <Button title="Close" onPress={toggleModal} />
            </View>
          </Modal>
        );
      }

         //https://github.com/react-native-modal/react-native-modal