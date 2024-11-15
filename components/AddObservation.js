import React, { useState } from 'react';
import { Button, View} from 'react-native-paper';
import Modal from 'react-native-modal';

export default function AddObservation ({navigation}){

    const Modal = () =>{
        const [isModalVisible, setModalVisible] = useState(false); //https://github.com/react-native-modal/react-native-modal

        const toggleModal = () => {
          setModalVisible(!isModalVisible);
        };

        return (
            <View style={{ flex: 1 }}>
              <Button title="Show modal" onPress={toggleModal} />
        
              <Modal isVisible={isModalVisible}>
                <View style={{ flex: 1 }}>
                  <Text>Hello!</Text>
        
                  <Button title="Hide modal" onPress={toggleModal} />
                </View>
              </Modal>
            </View>
          );
        }

    }


