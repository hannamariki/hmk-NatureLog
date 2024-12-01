import React from 'react';
import { useState, useEffect } from 'react'; 
import { View, Alert, Text } from 'react-native'; 
import MapView, { Marker } from 'react-native-maps'; 
import * as Location from 'expo-location';
import { IconButton, Modal } from 'react-native-paper';
import AddObservation from './AddObservation'; 
import { saveObservation, getObservation } from './firebase';
import ShowObservation from './ShowObservation';
import { styles } from './Styles';

export default function Map() {
  const [address, setAddress] = useState({ //puhelimen sijainnin koordinaatit alustettu 
    latitude: null,
    longitude: null,
  });
  const [positioning, setPositioning] = useState(null); //tila, jonne tallennetaan sijainnin tarkemmat tiedot 
  const [isModalVisible, setModalVisible] = useState(false);//AddObservationi modalain tila
  const [observations, setObservations] = useState([]); 
  const [isShowModalVisible, setShowModalVisible] = useState(false);
  const [selectObservation, setSelectObservation] = useState(null);

  // Hakee sijainnin ja asettaa sen tilaan
  const gePositioning = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync(); //kysytään lupaa käyttää sijaintia
    if (status !== 'granted') {
      Alert.alert('No permission to get location');
      return;
    }
    const positioning = await Location.getCurrentPositionAsync({}); //hakee laitteen nykyisen sijainnin
    setPositioning(positioning.coords)

    // Päivittää nykyisen sijainnin koordinaatit
    setAddress({
      latitude: positioning.coords.latitude,
      longitude: positioning.coords.longitude
    });
  }

  // Käynnistetään sijainnin haku kun komponentti on ladattu
  useEffect(() => {
    gePositioning();
  }, []);

  //haetaan havainnot Firebasesta
  useEffect(() => {
    const loadObservations = async () => {
      try {
       const data = await getObservation();
       setObservations(data);
      }catch (error) {
        console.error("Error fetching observations: ", error);
       }
      };
      loadObservations();
    }, []); //haetaan havainto vain kerran
  


//Keskittää kartan käyttäjän nykyiseen sijaintiin
  const centerLocation = () => {
    if (positioning) {
      mapViewRef.current.animateToRegion({ //animoi karttanäkymän oikeaan pisteeseen
        latitude: positioning.latitude,
        longitude: positioning.longitude,
        latitudeDelta: 0.0322,
        longitudeDelta: 0.0221,
      });
    }
  };

  const mapViewRef = React.createRef(); //referenssi eli Reactin sisäänrakennettu tapa viitata komponenttiin suoraan.

  const toggleModal = () => { //tällä hallitaan Modaalin näkymää
    setModalVisible(!isModalVisible);
  };

  //tallennetaan havainto
  const handleSave = (observation) => { 
    if (!observation.name || !observation.icon) {
      Alert.alert('Virhe', 'Havaintotiedot ovat puutteelliset');
      return;
    }
     
    try {
      saveObservation({
        ...observation,
        latitude: address.latitude,
        longitude: address.longitude,
      });
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Virhe', 'Havaintoa ei voitu tallentaa: ' + error.message);
    } setModalVisible(false); 
    
  };

  return (
    <View style={styles.container}>
      
      <Text style={styles.headerText}>NatureLog</Text>
      {address.longitude && address.latitude && (
        <MapView
        ref={mapViewRef} //viittaus
          style={{ width: "100%", height: "80%" }}
          region={{
            latitude: address.latitude,
            longitude: address.longitude,
            latitudeDelta: 0.0322,
            longitudeDelta: 0.0221
          }}
        >
          {/*Nykyinen sijainti */}
          <Marker
            coordinate={{
              latitude: address.latitude,
              longitude: address.longitude
            }}
           
          />
          {/*Havainnot kartalla */}
          {observations.map((observation) =>(
            observation.latitude && observation.longitude && (
            <Marker
            key={observation.id}
            coordinate ={{
              latitude: observation.latitude,
              longitude: observation.longitude,
            }}
            zIndex={1} //määrittää järjestyksen, jotta saadaan iconi näkyviin

            onPress={()=>{ //Avaa modalin, joka näyttää tallannetun havainnon tiedot
              setSelectObservation(observation);
              setModalVisible(false);
              setShowModalVisible(true);
            }}
            >

              <View>
                <Text style={{ fontSize: 27 }}>{observation.icon}</Text>
                
              </View>
            </Marker>
            )
          ))}

        </MapView>
      )}
     <View style={styles.buttonRow}>
        <IconButton
          icon="pencil"
          size={30}
          onPress={toggleModal}
          color="#000"
          style={styles.iconButton}
        />
        <IconButton
          icon="map-marker"
          size={30}
          onPress={centerLocation}
          color="#000"
          style={styles.iconButton}
        />
      </View>


    <Modal
        visible={isModalVisible}
        onDismiss={() => setModalVisible(false)}  // Suljetaan modal
        animationType="slide"
      >
        <AddObservation 
          onSave={handleSave} 
          onClose={() => setModalVisible(false)} 
          latitude = {address.latitude}
          longitude = {address.longitude}
        />
        </Modal>

        <Modal

          visible={isShowModalVisible}
          onDismiss={() => setShowModalVisible(false)}
          animationType="slide"
          >
        <ShowObservation
        visible={isShowModalVisible}
        onClose={() => setShowModalVisible(false)}
        observation={selectObservation}
        />
           </Modal>


    </View>
  );
};

