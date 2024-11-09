// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"; // kirjautuminen ja registeröityminen
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore"; // tietojen tallentaminen ja hakeminen tietkokannsta 
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
const auth = getAuth(app); 
const db = getFirestore(app);



//Rekisteröityminen
export const registerUser = async (email, password) => { //asynkroninen funktio, jolla luodaan uusi käyttäjä
    try {
        const authenticatedUser = await createUserWithEmailAndPassword(auth, email, password); //await ottaa yhteyden firebase metodiin, joka luo uuden käyttäjätilin sähköpostilla ja salasanan https://firebase.google.com/docs/auth/android/start?hl=en&authuser=0#sign_up_new_users
        const user = authenticatedUser.user; //sisältää käyttäjän tiedot
        console.log("User registered:", user);
    }catch (error){
        console.error("Error registering user:", error.message);
    }
};

//Kirjautuminen
const loginUser = async (email, password) => {//kirjaa käyttäjän sisään sähköpostilla ja salasanalla
    try{
        const authenticatedUser = await signInWithEmailAndPassword(auth, email, password); // tarkastetaan onko käyttäjällä oikea salasana ja sähköposti, jos on, antaa kirjautua sisään https://firebase.google.com/docs/auth/android/password-auth?hl=en#sign_in_a_user_with_an_email_address_and_password
        const user = authenticatedUser.user;
        console.log("User logged in:", user);
    }catch (error){
        console.error("Error logging in user:", error.message);
    }
};

//Havainnon tallentaminen Cloud Firestoreen
const saveObservation = async (observation) => { //tallentaa uuden havainnon 
    try {
        const docRef = await addDoc(collection(db, "observations"), observation); 
        // addDoc lisää uuden dokumentin tietokantaan ja luo automaattisesti id:n dokumentille https://firebase.google.com/docs/firestore/manage-data/add-data#add_a_document
        //collection(db, "observations") tämä määrittää mihin kokoelmaan dokumentti lisätään, ja mikä on kokoelman nimi ("observations")
        //observation sisältää havaintotiedot
        
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
      }
    };

  //Havaintojen tuominen Cloud Firestoresta
  const getObservation = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "observations"));
        //getDoc hakee kaikki dokumentit observations kokoelmasta https://firebase.google.com/docs/firestore/query-data/get-data#get_multiple_documents_from_a_collection
        //  querySnapshot sisältää kaikki haetut objektit
        querySnapshot.forEach((doc) => {
            //forEach käy läpi kaikki dokumentit ja tulostaa niidet id:t ja datan
            console.log(doc.id, " => ", doc.data());
        });
    }catch (e) {
        console.error("Error getting documents: ", e);
    }
}; //Get multiple documents from a collection avulla pitäisi näkyä kaikki havainnot kartalla, ei vain yksi havainto

export { auth, db };