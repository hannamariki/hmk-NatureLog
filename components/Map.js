import React from 'react';
import { useState, useEffect } from 'react'; 
import { StyleSheet, View, Alert, TextInput, Button } from 'react-native'; 
import MapView, { Marker } from 'react-native-maps'; 
import * as Location from 'expo-location';
import { IconButton } from 'react-native-paper';
import AddObservation from './AddObservation'; 

export default function App() {
  const [address, setAddress] = useState({ //puhelimen sijainnin koordinaatit alustettu 
    latitude: null,
    longitude: null,
  });
  const [positioning, setPositioning] = useState(null); //tila, jonne tallennetaan sijainnin tarkemmat tiedot 
  const [isModalVisible, setModalVisible] = useState(false);

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

      if (data.status === 'OK' && data.results.length > 0) { //tarkistetaan onko API kutsu käsitellyt pyynnön onnistuneesti ja palauttanut utloksia
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

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
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
          <Marker
            coordinate={{
              latitude: address.latitude,
              longitude: address.longitude
            }}
           
          />
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
    <AddObservation isModalVisible={isModalVisible} toggleModal={toggleModal} />
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
