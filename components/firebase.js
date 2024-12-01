// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc,  deleteDoc } from "firebase/firestore"; // tietojen tallentaminen ja hakeminen tietkokannsta 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpsHSPVJxImx2lVBvlxu4WPRtZaUcTD78",
  authDomain: "naturelog-6f428.firebaseapp.com",
  projectId: "naturelog-6f428",
  storageBucket: "naturelog-6f428.firebasestorage.app",
  messagingSenderId: "297673079474",
  appId: "1:297673079474:web:a741411ef6700976bf27ab"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);



//Havainnon tallentaminen Cloud Firestoreen
const saveObservation = async (folder, observation) => { //tallentaa uuden havainnon 
    try {
      const folderRef = collection(db, 'folders', folder, 'observations'); // Accessing specific folder's sub-collection
      console.log("folderRef:", folderRef);
      const docRef = await addDoc(folderRef, {
            name: observation.name,
            description: observation.description,
            icon: observation.icon,
            folder: observation.folder,
            latitude: observation.latitude, // Lisätään koordinaatit
            longitude: observation.longitude, 
        
        }); 
        console.log("Name:", observation.name);
        console.log("Icon:", observation.icon);
        console.log("Description:", observation.description);
        console.log("Folder:", observation.folder);
        console.log("Latitude:", observation.latitude);
        console.log("Longitude:", observation.longitude);
        // addDoc lisää uuden dokumentin tietokantaan ja luo automaattisesti id:n dokumentille https://firebase.google.com/docs/firestore/manage-data/add-data#add_a_document
        //collection(db, "observations") tämä määrittää mihin kokoelmaan dokumentti lisätään, ja mikä on kokoelman nimi ("observations")
        //observation sisältää havaintotiedot

        
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
        Alert.alert('Virhe', 'Havaintoa ei voitu tallentaa: ' + e.message);
        throw new Error("Tallennus epäonnistui");
      }
    };

  //Havaintojen tuominen Cloud Firestoresta
  const getObservation = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "observations"));
        //getDoc hakee kaikki dokumentit observations kokoelmasta https://firebase.google.com/docs/firestore/query-data/get-data#get_multiple_documents_from_a_collection
        //  querySnapshot sisältää kaikki haetut objektit
        const data = [];
        querySnapshot.forEach((doc) => {
            //forEach käy läpi kaikki dokumentit ja tulostaa niidet id:t ja datan
           data.push({id: doc.id, ...doc.data() });
        });
       
        return data;

    }catch (e) {
        console.error("Error getting documents: ", e);
        return [];
    }
}; //Get multiple documents from a collection avulla pitäisi näkyä kaikki havainnot kartalla, ei vain yksi havainto

export const saveFolder = async (folderName) => {
  try {
    const docRef = await addDoc(collection(db, 'folders'), { name: folderName });
    console.log("Folder saved with ID: ", docRef.id);
  } catch (e) {
    console.error("Error saving folder: ", e);
  }
};

// Hae kaikki kansiot Firebase-tietokannasta
export const getFolders = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'folders'));
    const folders = querySnapshot.docs.map(doc => doc.data().name);
    console.log("Fetched folders data:", folders); 
    return folders;  
  } catch (e) {
    console.error("Error fetching folders: ", e);
    return [];  
  }
};

//Olemassa olevien havaintojen päivittäminen
const updateObservation = async (observationId, updatedData) => {
  try {
      const observationRef = doc(db, "observations", observationId); // Haetaan dokumentti ID:n perusteella
      await updateDoc(observationRef, updatedData); // Päivitetään tiedot
      console.log("Observation updated successfully!");
  } catch (e) {
      console.error("Error updating observation: ", e);
  }
};
const deleteObservation = async (observationId) => {
  try {
    // Poista havainto Firestore-tietokannasta
    await deleteDoc(doc(db, "observations", observationId)); 
    console.log("Havainto poistettu onnistuneesti!");
  } catch (error) {
    console.error("Virhe poistaessa havaintoa: ", error);
    throw error; // Heitetään virhe, jotta se voidaan käsitellä komponentissa
  }
};


export { db, saveObservation, getObservation, updateObservation, deleteObservation  };