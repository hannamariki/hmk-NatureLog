import React from 'react';
import { useState, useEffect } from 'react'; 
import { StyleSheet, View, Alert, TextInput, Button, Text } from 'react-native'; 
import MapView, { Marker } from 'react-native-maps'; 
import * as Location from 'expo-location';
import { IconButton, Modal } from 'react-native-paper';
import AddObservation from './AddObservation'; 
import { saveObservation, getObservation } from './firebase';
import EditObservation from './EditObservation';

export default function Map() {
  const [address, setAddress] = useState({ //puhelimen sijainnin koordinaatit alustettu 
    latitude: null,
    longitude: null,
  });
  const [positioning, setPositioning] = useState(null); //tila, jonne tallennetaan sijainnin tarkemmat tiedot 
  const [isModalVisible, setModalVisible] = useState(false);//AddObservationi modalain tila
  const [observations, setObservations] = useState([]); //tila havaintojen tallentamiseen
  const [isEditModalVisible, setEditModalVisible] = useState(false); //EditObservation modalin tila
  const [selectObservation, setSelectObservation] = useState(null);

  // Hakee sijainnin ja asettaa sen tilaan
  const gePositioning = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync(); //kysytään lupaa käyttää sijaintia
    if (status !== 'granted') {
      Alert.alert('No permission to get location');
      return;
    }
    const positioning = await Location.getCurrentPositionAsync({}); //hakee laitteen nykyisen sijainnin
    setPositioning(positioning.coords);//tallennetaan koordinaatit positioning tilaan

    // Päivittää nykyisen sijainnin koordinaatit
    setAddress({
      latitude: positioning.coords.latitude,
      longitude: positioning.coords.longitude
    });
  }

//Hakee osoitteen käyttäen Google Maps Geocodin API:a ja koordinaatteja
  const getLocation = async (latitude, longitude) => {
    try {
      const apiKey = 'AIzaSyAZ2bqA050cPNhwymTgebQqVZGaZ3rD724';  
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`);
      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) { //tarkistetaan onko API kutsu käsitellyt pyynnön onnistuneesti ja palauttanut tuloksia
        const address = data.results[0].formatted_address; //kun tulokset on löytyneet, poimitaan ensimmäinen tulos ja muotoillaan siitä osoite. results on osoitteet sisältävä taulukko
       //formatted_address on valmis osoite
        Alert.alert('Address found:', address);
      } else {
        Alert.alert('No address found for these coordinates');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not fetch address');
    }
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
    }, []); //hataan havainto vain kerran
  


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
      setModalVisible(false); // Sulje modal onnistuneen tallennuksen jälkeen
    } catch (error) {
      Alert.alert('Virhe', 'Havaintoa ei voitu tallentaa: ' + error.message);
    } //kutsutaan firebase.js komponentissa olevaa tallennustilaa
    setModalVisible(false); 
  };

  return (
    <View style={styles.container}>
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
            
            title={observation.name}//näyttää tietolaatikon, jossa on nimi
            description={observation.description}//ja havintoteksti
            onPress={()=>{
              setSelectObservation(observation);
              setModalVisible(false);
              setEditModalVisible(true);
            }}
            >

              <View>
                <Text style={{ fontSize: 25 }}>{observation.icon}</Text>
                
              </View>
            </Marker>
            )
          ))}

        </MapView>
      )}
      <View style={styles.inputContainer}>
        <Button title="Center Location" onPress={centerLocation} />
      </View>

      <View style={styles.addObservationContainer}>
        <IconButton
          icon="pencil" 
          size={30}
          onPress={toggleModal}
          color="#000" 
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

          visible={isEditModalVisible}
          onDismiss={() => setEditModalVisible(false)}
          animationType="slide"
          >
        <EditObservation
        visible={isEditModalVisible}
        onClose={() => setEditModalVisible(false)}
        observation={selectObservation}
        />
           </Modal>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: 10,
  },
  addObservationContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 10, 
  },
});
