// HomeScreen.js
import React, { useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, TextInput, Image, TouchableWithoutFeedback, DrawerLayoutAndroid, Platform, TouchableOpacity, BackHandler, Alert } from 'react-native';
import { IconButton, Drawer, Button, Modal, Portal, Text } from 'react-native-paper';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { SvgXml } from 'react-native-svg';
import { logo_horizontal } from '../../utils/Logo';
import LocationView from '../../pages/LocationView';
import { useAuth } from '../../hooks/AuthContext';
import EditProfile from '../User/EditProfile';
import ModalBooking from '../Booking/ModalBooking';
import { createBooking } from '../../services/Booking/booking';
import Spinner from '../../pages/SpinnerActivity';
import { iconModal } from '../../utils/Icons';
import ModalDialog from '../../pages/Dialog';
import Header from './Header';


function Home({ route }) {
  const navigation = useNavigation();
  const [activeButton, setActiveButton] = useState('Pasajero');
  const { user, updateUser } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [city, setCity] = useState(null);
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [finishModal, setFinishModal] = useState(false);

  useEffect(() => {
    updateUser({ ...user })
  }, [])


  const handleButtonPress = (buttonName) => {
    setActiveButton(buttonName);
  };

  const openModal = () => {
    updateUser({ ...user, city })
    setModalVisible(true);
  };

  const closeModal = async (object) => {
    setModalVisible(false);
    if (object?.origin) {
      setLoadingSpinner(true)
      const response = await createBooking({ ...object, ...user })
      setLoadingSpinner(false)
      if(!response?.descripcion){
        setVisibleModal(true)
      }else{
        setFinishModal(true)
      }
    }
  };

  const handleCityChange = (newCity) => {
    setCity(newCity);
  };

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp()
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const hideDialog = () => {
    setVisibleModal(false)
  }

  const hideDialogFinish = () => {
    setFinishModal(false)
  }


  return (
    <View style={styles.container}>
      <LocationView onCityChange={handleCityChange} />
      <Header/>
      <View style={styles.bottomContainer}>
        <View style={styles.inputContainer}>
          <IconButton icon="magnify" size={20} style={styles.iconButton} iconColor='rgba(130, 130, 130, 1)' />
          <TouchableOpacity onPress={openModal} style={styles.searchButton}>
            <Text style={styles.searchButtonText}>¿A dónde quieres ir?</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, activeButton === 'Pasajero' && styles.activeButton]}
            onPress={() => handleButtonPress('Pasajero')}
          >
            <Text style={[styles.bottomButtonText, activeButton === 'Pasajero' && styles.activeButtonText]}>
              Pasajero
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.secondButton, activeButton === 'Encomienda' && styles.activeButton]}
            onPress={() => handleButtonPress('Encomienda')}
          >
            <Text style={[styles.bottomButtonText, activeButton === 'Encomienda' && styles.activeButtonText]}>
              Encomienda
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <ModalBooking visible={modalVisible} onDismiss={closeModal} city={city} typeBooking={activeButton} />
      {loadingSpinner && (
        <Spinner />
      )}
      <ModalDialog
        visibleModal={visibleModal}
        title="Ups!"
        description='Hubo un error al crear la reserva'
        icon={iconModal.alert}
        hideDialog={hideDialog}
        colorIcon='rgb(186, 26, 26)'
      />
      <ModalDialog
        visibleModal={finishModal}
        title="Reserva Exitosa"
        description="Su reserva ha sido creada exitosamente.Se le notificara cuando se le asigne un conductor"
        icon={iconModal.check}
        hideDialog={hideDialogFinish}
        colorIcon='rgba(200, 230, 201, 1)'
        textButton='Ir a reservas'
      />
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: 'white',
    justifyContent: 'space-between'
  },
  map: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10
  },
  leftIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 40,
  },
  menu: {
    color: 'rgba(173, 216, 230, 1)',
    backgroundColor: "rgba(173, 216, 230, 1)",
    borderRadius: 4,
  },
  logo: {
    width: 100,
    height: 22,
    resizeMode: 'contain',
  },
  bottomContainer: {
    backgroundColor: 'rgba(173, 216, 230, 0.3)',
    padding: 7,
    marginHorizontal: 8,
    marginBottom: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(9, 44, 76, 1)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    height: 54,
    borderWidth: 1,
    borderColor: 'rgba(9, 44, 76, 1)',
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: 10,
    color: 'black',
    fontWeight: 'bold'
  },
  iconButton: {
    backgroundColor: 'white',
  },
  searchButton: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: 'rgba(130, 130, 130, 1)',
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    borderWidth:1,
    marginTop: 5,
    borderRadius: 10,
    borderColor: '#092C4C',
  },
  button: {
    flex: 1,
    height: 50,
    paddingVertical: 12,
    alignItems: 'center',
    borderColor: '#003366',
    borderRadius:10,
    backgroundColor: 'white',
    marginRight:-3,
    zIndex:10
  },
  secondButton: {
    flex: 1,
    height: 50,
    marginHorizontal: -2,
    marginLeft: -2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderTopRightRadius:10,
    borderBottomRightRadius:10,
    borderRadius:10,
    borderRightWidth:1
  },
  bottomButtonText: {
    textAlign: 'center',
    color: 'rgba(65, 65, 65, 1)',
    fontSize: 16,
    fontWeight: 'bold'
  },
  activeButton: {
    backgroundColor: 'rgba(9, 44, 76, 1)',
  },
  activeButtonText: {
    color: 'white',
  },
});

export default Home;
