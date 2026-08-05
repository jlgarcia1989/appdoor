import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Avatar, Button, Drawer, Icon, IconButton, MD3Colors, Modal, Portal, Text } from 'react-native-paper';
import { useAuth } from '../../hooks/AuthContext';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import Spinner from '../../pages/SpinnerActivity';
import ConfirmCancelDialog from '../../pages/ConfirmDialog';
import { iconModal } from '../../utils/Icons';
import { createUser, userExist } from '../../services/User/User';
import { messageDriver, messageUser } from '../../utils/Utils';

const CustomDrawerContent = ({ state, navigation, descriptors }) => {
  const [avatarSource, setAvatarSource] = useState(null);
  const [activeButton, setActiveButton] = useState('Usuario');
  const { user, closeDrawer, updateUser,setUserType,userType } = useAuth();
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [visibleConfirm, setVisibleConfirm] = useState(false);
  const [role, setRole] = useState('Usuario');

  const handleButtonPress = (buttonName) => {
    setVisibleConfirm(true);
    setRole(buttonName);
  };

  const cancelTypeUser = () => {
    setRole(userType)
    setVisibleConfirm(!visibleConfirm)
  }

  const confirmTypeUser = async () => {
    setLoadingSpinner(true)
    const phoneNumber = user?.phoneNumber ? user?.phoneNumber : user?.numeroCelular
    const userSession = await userExist(phoneNumber)
    setUserType(role);
    setVisibleConfirm(!visibleConfirm);
    if (userSession?.esConductor && role === 'Conductor') {
      setLoadingSpinner(false);
      navigation.navigate('HomeDriver');
    } else if (role === 'Conductor') {
      const userCreated = await createUser({ ...user, esConductor: true });
      updateUser({ ...userCreated })
      setLoadingSpinner(false)
      navigation.navigate('Driver');
    } else if (role === 'Usuario'){
       navigation.navigate('Home');
    }
    setLoadingSpinner(false)
  }


  return (
    <>
      {loadingSpinner ? (
        <Portal>
          <Spinner />
        </Portal>
      ) :
        <View style={styles.drawerContainer}>
          <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.closeDrawer())} style={styles.backButtonContainer}>
            <Button icon="arrow-left" textColor='rgba(65, 67, 65, 1)' contentStyle={styles.backButton} labelStyle={{ fontSize: 16 }}>
              Regresar
            </Button>
          </TouchableOpacity>
          <View style={styles.profileContainer}>
            <View style={styles.avatarContainer}>
              <Avatar.Image
                size={70}
                style={styles.avatarImage}
                source={{ uri: user?.urlImagen?.replace(/\\/g, '/') }}
              />
            </View>
            <Text style={styles.profileName}>{user?.nombre} {user?.primerApellido}</Text>
            <Text style={styles.profilePhone}>{user?.numeroCelular}</Text>
          </View>
          <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('Perfil')}>
            <Button
              icon="account-edit-outline"
              textColor='rgba(65, 65, 65, 1)'
              contentStyle={styles.drawerButtonContent}
              labelStyle={styles.drawerItemText}
              style={styles.drawerButton}
            >
              Editar Perfil
            </Button>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('Address')}>
            <Button
              icon="map-marker-outline"
              textColor='rgba(65, 65, 65, 1)'
              contentStyle={styles.drawerButtonContent}
              labelStyle={styles.drawerItemText}
              style={styles.drawerButton}
            >
              Direcciones
            </Button>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('Historial')}>
            <Button
              icon="map-legend"
              textColor='rgba(65, 65, 65, 1)'
              contentStyle={styles.drawerButtonContent}
              labelStyle={styles.drawerItemText}
              style={styles.drawerButton}
            >
              Historial
            </Button>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('About')}>
            <Button
              icon="alert-circle-outline"
              textColor='rgba(65, 65, 65, 1)'
              contentStyle={styles.drawerButtonContent}
              labelStyle={styles.drawerItemText}
              style={styles.drawerButton}
            >
              Sobre Nosotros
            </Button>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('Settings')}>
            <Button
              icon="cog-outline"
              textColor='rgba(65, 65, 65, 1)'
              contentStyle={styles.drawerButtonContent}
              labelStyle={styles.drawerItemText}
              style={styles.drawerButton}
            >
              Configuración
            </Button>

          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('Help')}>
            <Button
              icon="help-circle-outline"
              textColor='rgba(65, 65, 65, 1)'
              contentStyle={styles.drawerButtonContent}
              labelStyle={styles.drawerItemText}
              style={styles.drawerButton}
            >
              Ayuda y Soporte
            </Button>

          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('Welcome')}>
            <Button
              icon="location-exit"
              textColor='rgba(65, 65, 65, 1)'
              contentStyle={styles.drawerButtonContent}
              labelStyle={styles.drawerItemText}
              style={styles.drawerButton}
            >
              Cerrar Sesión
            </Button>
          </TouchableOpacity>
          <View style={styles.bottomButtonsContainer}>
            <TouchableOpacity
              style={[styles.bottomButton, userType === 'Usuario' && styles.activeButton]}
              onPress={() => handleButtonPress('Usuario')}
              disabled={userType === 'Usuario'}
            >
              <Text style={[styles.bottomButtonText, userType === 'Usuario' && styles.activeButtonText]}>
                Usuario
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.bottomButton, userType === 'Conductor' && styles.activeButton]}
              onPress={() => handleButtonPress('Conductor')}
              disabled={userType === 'Conductor'}
            >
              <Text style={[styles.bottomButtonText, userType === 'Conductor' && styles.activeButtonText]}>
                Conductor
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      }
      <Portal>
        <ConfirmCancelDialog
          visibleModal={visibleConfirm}
          title={`Cambiar al modo ${role}`}
          description= {`¿Deseas activar el modo ${role === 'Usuario' ? messageUser : messageDriver }`}
          icon={iconModal.alert}
          hideDialog={cancelTypeUser}
          colorIcon='#ADD8E6'
          confirmAction={confirmTypeUser}
        />
      </Portal>
    </>

  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderWidth: 1,
    borderBottomRightRadius: 50,
    borderTopRightRadius: 50,
  },
  titleOption: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgba(65, 65, 65, 1)rgba(65, 65, 65, 1)',
  },
  backButtonContainer: {
    alignSelf: 'flex-start',
    marginBottom: 10,
    marginLeft: -10,
  },
  backButton: {
    padding: 0
  },
  profileContainer: {
    marginLeft: 15,
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginLeft: 15,
    marginTop: 20
  },
  avatarImage: {
    backgroundColor: 'rgba(208, 208, 208, 1)',
  },
  cameraButton: {
    position: 'absolute',
    bottom: -5,
    right: 150,
    backgroundColor: 'black',
    borderRadius: 50,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black'
  },
  profilePhone: {
    fontSize: 12,
    color: "black",
  },
  drawerButtonContent: {
    flexDirection: 'row',
  },
  drawerButton: {
    alignItems: 'baseline',
    marginLeft: -15,
    marginBottom: -15,
  },
  drawerItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(232, 232, 232, 1)'
  },
  drawerItemText: {
    fontSize: 14,
    color: 'rgba(65, 65, 65, 1)',
    fontFamily: 'Small Text Regular'
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 'auto',
    marginBottom: 20,
    borderWidth:1,
    borderRadius: 10,
    borderColor: '#092C4C',
  },
  bottomButton: {
    flex: 1,
    width: 240,
    height: 48,
    borderColor: 'black',
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: -2,
    marginLeft: -2
  },
  bottomButtonText: {
    textAlign: 'center',
    color: 'black',
    fontSize: 16
  },
  activeButton: {
    backgroundColor: 'rgba(9, 44, 76, 1)',
    color: 'black'
  },
  activeButtonText: {
    color: 'white'
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});

export default CustomDrawerContent;