import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({

    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Puoli läpinäkyvä tausta
      },
      modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        width: '80%',
        borderRadius: 10,
        elevation: 5,
      
      },
      input: {
        fontSize: 14,
        marginBottom: 30,
      },
      icon: {
        fontSize: 27
        ,
      },
      iconButton: {
        marginTop: 5,
        padding: 10,
      },
      iconList: {
        flexDirection: 'row',  
        flexWrap: 'wrap',     
        justifyContent: 'space-around', 
      },
      iconItem: {
        margin: 10,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
      },
      iconModalContent: {
        backgroundColor: '#fff',
        padding: 10,
        width: '80%',
        borderRadius: 10,
        elevation: 5,
      },
      modalHeader: {
        fontSize: 14,
        marginBottom: 4,
        textAlign: 'center',
      },
      descriptionInput: {
        height: 120, 
        fontSize: 14,
        marginBottom: 20,
      },
      descriptionText:{
        fontSize: 14,
        marginBottom: 30,
        color: '#808080',
      },
      paragraph:{
        marginBottom: 20,
      }
      
    });
