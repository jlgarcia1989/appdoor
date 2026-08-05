import React, { useEffect, useRef, useState } from 'react';
import { Linking, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Avatar, Button, Chip, IconButton, MD3Colors, Modal, Portal, TextInput, Provider as PaperProvider, DefaultTheme, shadow, Text, Dialog } from 'react-native-paper'; // Importa componentes de React Native Paper
import { useNavigation, useRoute } from '@react-navigation/native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { requestCameraPermission } from '../../hooks/RequestPermissionCamera';
import { Formik, FormikErrors, FormikValues } from 'formik';
import * as yup from 'yup';
import { ScrollView } from 'react-native-gesture-handler';
import ModalDialog from '../../pages/Dialog';
import { iconModal } from '../../utils/Icons';
import { useAuth } from '../../hooks/AuthContext';
import Spinner from '../../pages/SpinnerActivity';

import DatePicker from 'react-native-neat-date-picker'
import { editUser } from '../../services/User/User';
import { getFullDate } from '../../utils/Utils';
import Header from '../Home/Header';

export default function EditProfile({ visible, onClose }) {
  const navigation = useNavigation();
  const [avatarSource, setAvatarSource] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [finishModal, setFinishModal] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [typesUsers, setTypesUsers] = useState([]);
  const [date, setDate] = useState(null);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [textModal, setTextModal] = useState("Debes completar todos los campos requeridos");
  const [imageProfile, setImageProfile] = useState(null);
  const { user, login, updateUser, closeDrawer, openDrawer } = useAuth();
  const [dialogVisible, setDialogVisible] = useState(false);

  const today = new Date();
  const fifteenYearsAgo = new Date(today.setFullYear(today.getFullYear() - 15));

  useEffect(() => {
    requestCameraPermission();
    if(user && user?.urlImagen){
      setAvatarSource(user.urlImagen.replace(/\\/g, '/') )
    }
  }, []);


  const hideDialog = () => {
    setTextModal("Debes completar todos los campos requeridos")
    setVisibleModal(false)
  }

  const hideDialogFinish = () => {
    setFinishModal(false)
  }

  const initialValues = {
    name: user?.nombre,
    lastName: `${user?.primerApellido} ${user?.segundoApellido ? user?.segundoApellido : ''}`,
    fechaNacimiento: user?.fechaNacimiento ? getFullDate(user.fechaNacimiento) : '',
    correo: user?.correo,
    direccion: user?.direccion,
    numeroIdentificacion:user?.numeroIdentificacion,
    phoneNumber:user?.numeroCelular
  };

  const handleChooseFromGallery = async () => {
    if (await requestCameraPermission()) {
      launchImageLibrary({ mediaType: 'photo' }, response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else {
          console.log(response.assets)
          setAvatarSource(response.assets[0].uri);
          setImageProfile(response.assets[0])
          setModalVisible(false); // Cierra el modal después de seleccionar una imagen
        }
      });
      setDialogVisible(false);
    } else {
      Linking.openSettings();
    }
  };

  const openCamera = async () => {
    if (await requestCameraPermission()) {
      launchCamera({ mediaType: 'photo', cameraType: 'back' }, (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else {
          setAvatarSource(response.assets[0].uri);
          setImageProfile(response.assets[0])
          console.log(response.assets[0]);
        }
      });
      setDialogVisible(false)
    }
    else {
      Linking.openSettings();
    }
  };

  const validationSchema = yup.object().shape({
    name: yup.string()
      .trim()
      .required('Ingrese sus nombres')
      .matches(/^[a-zA-Z\s]+$/, 'El nombre solo debe contener letras y espacios'),
    lastName: yup.string()
      .trim()
      .required('Ingrese sus apellidos')
      .matches(/^[a-zA-Z\s]+$/, 'El apellido solo debe contener letras y espacios'),
    correo: yup.string()
      .trim()
      .required('Ingrese su correo electrónico')
      .email('Ingrese un correo electrónico válido'),
    fechaNacimiento: yup.string().trim().required('Ingrese su fecha de nacimiento')
    .test('is-over-18', 'Debe tener al menos 18 años', function(value) {
      let birthDate = new Date(value);
      if(value.includes('/')){
        const partes = value.split('/');
        const year = parseInt(partes[0], 10);
        const month = parseInt(partes[1], 10) - 1; // Restar 1 al mes porque es 0-indexado
        const day = parseInt(partes[2], 10);
        birthDate = new Date(year, month, day);
      }
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
      }
      console.log('age',age)
      return age >= 18;
  }),
    direccion: yup.string().trim().required('Ingrese su direccion'),
  });

  const handleSubmit = async (values) => {
    try {
      console.log('values.::',values)
      await validationSchema.validate(values, { abortEarly: false });
      setLoadingSpinner(true)
      const update = await editUser({ ...user, ...values, imageProfile, fechaNacimiento: !date ? user?.fechaNacimiento : date })
      if (update) {
        setFinishModal(true)
        updateUser({
          ...update,
          idUsuario: user?.idUsuario
        })
        setTimeout(() => {
          closeDrawer()
          navigation.navigate('Home')
          setFinishModal(false)
        }, 3000);
        setLoadingSpinner(false)
      } else {
        setTextModal('Ha ocurrido un error al editar el usuario')
        setVisibleModal(true)
        setLoadingSpinner(false)
      }
    } catch (errors) {
      console.log(errors.inner.map((error) => error.message));
      if (errors.inner.length === 1 && errors.inner.find((e) => e.message === 'Ingrese un correo electrónico válido')) {
        setTextModal('Ingrese un correo electrónico válido')
      }
      setVisibleModal(true)
    }
  };



  return (

    <View style={styles.container}>
      <Header paddingR={0}/>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isValid,
          isSubmitting,
          setFieldValue
        }) => (
          <>
            <ScrollView>
              <View style={styles.avatarContainer}>
                <Avatar.Image
                  size={118}
                  style={styles.avatarImage}
                  source={{ uri: avatarSource }}
                />
                <IconButton
                  icon="camera-outline"
                  iconColor={MD3Colors.neutralVariant99}
                  size={15}
                  mode='outlined'
                  style={styles.cameraButton}
                  onPress={()=>setDialogVisible(true)}
                />
              </View>
              <View style={styles.infoContainer}>
                <TextInput
                  label="Nombres"
                  mode="outlined"
                  activeOutlineColor='rgba(100, 100, 100, 1)'
                  textColor="black"
                  style={styles.input}
                  readOnly={true}
                  outlineStyle={[
                    styles.inputOutline,
                    touched.name && errors.name ? styles.inputError : null,
                  ]}
                  onChangeText={(text) => {
                    const filteredText = text.replace(/[^a-zA-ZñÑ\s]+/g, '');
                    setFieldValue('name', filteredText);
                  }}
                  onBlur={handleBlur('name')}
                  value={values.name}
                />
                <TextInput
                  label="Apellidos"
                  mode="outlined"
                  activeOutlineColor='rgba(100, 100, 100, 1)'
                  textColor="black"
                  style={styles.input}
                  outlineStyle={[
                    styles.inputOutline,
                    touched.lastName && errors.lastName ? styles.inputError : null,
                  ]}
                  onChangeText={(text) => {
                    const filteredText = text.replace(/[^a-zA-ZñÑ\s]+/g, '');
                    setFieldValue('lastName', filteredText);
                  }}
                  onBlur={handleBlur('lastName')}
                  value={values.lastName}
                  readOnly={true}
                />
                <TextInput
                  label="Correo electrónico"
                  mode="outlined"
                  keyboardType='email-address'
                  activeOutlineColor='rgba(100, 100, 100, 1)'
                  textColor="black"
                  style={styles.input}
                  outlineStyle={[
                    styles.inputOutline,
                    touched.correo && errors.correo ? styles.inputError : null,
                  ]}
                  onChangeText={(text) => {
                    const filteredText = text.trim();
                    handleChange('correo')(filteredText);
                  }}
                  onBlur={handleBlur('correo')}
                  value={values.correo}
                  error={touched.correo && errors.correo ? true : false}
                />
                {touched.correo && errors.correo && <Text style={styles.errorText}>{errors.correo}</Text>}
                <TextInput
                  label="Cédula"
                  mode="outlined"
                  keyboardType='numeric'
                  activeOutlineColor='rgba(100, 100, 100, 1)'
                  textColor="black"
                  style={styles.input}
                  outlineStyle={[
                    styles.inputOutline,
                    touched.name && errors.name ? styles.inputError : null,
                  ]}
                  onChangeText={(text) => {
                    const formattedText = text.replace(/[^\d]/g, '').trim();
                    handleChange('numeroIdentificacion')(formattedText);
                  }}
                  onBlur={handleBlur('numeroIdentificacion')}
                  value={values.numeroIdentificacion}
                  maxLength={11}
                  minLength={6}
                  readOnly={true}
                />
                <TextInput
                  label="Número de Celular"
                  mode="outlined"
                  activeOutlineColor='rgba(100, 100, 100, 1)'
                  textColor="black"
                  style={styles.input}
                  outlineStyle={styles.inputOutline}
                  keyboardType='numeric'
                  textContentType='telephoneNumber'
                  readOnly={true}
                  value={values?.phoneNumber}
                  maxLength={10}
                />
                <TouchableOpacity onPress={() => setOpenDatePicker(true)}>
                  <TextInput
                    label="Fecha de Nacimiento"
                    mode="outlined"
                    activeOutlineColor='rgba(100, 100, 100, 1)'
                    textColor="black"
                    style={styles.input}
                    outlineStyle={[
                      styles.inputOutline,
                      touched.fechaNacimiento && errors.fechaNacimiento ? styles.inputError : null,
                    ]}
                    onFocus={() => setOpenDatePicker(true)}
                    value={values.fechaNacimiento}
                    showSoftInputOnFocus={false}
                    editable={false}
                    error={touched.fechaNacimiento && errors.fechaNacimiento ? true : false}
                  />
                  {touched.fechaNacimiento && errors.fechaNacimiento && <Text style={styles.errorText}>{errors.fechaNacimiento}</Text>}
                </TouchableOpacity>
                <TextInput
                  label="Direccion"
                  mode="outlined"
                  activeOutlineColor='rgba(100, 100, 100, 1)'
                  textColor="black"
                  style={styles.input}
                  outlineStyle={[
                    styles.inputOutline,
                    touched.direccion && errors.direccion ? styles.inputError : null,
                  ]}
                  onChangeText={(text) => {
                    setFieldValue('direccion', text);
                  }}
                  onBlur={handleBlur('direccion')}
                  value={values.direccion}
                  error={touched.direccion && errors.direccion ? true : false}
                />
                {touched.direccion && errors.direccion && <Text style={styles.errorText}>{errors.direccion}</Text>}
              </View>
            </ScrollView>
            <Portal>
              <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContainer}>
                <Button onPress={handleChooseFromGallery} style={styles.modalButton}>Seleccionar de Galería</Button>
              </Modal>
            </Portal>
            <ModalDialog
              visibleModal={visibleModal}
              title="Ups!"
              description={textModal}
              icon={iconModal.alert}
              hideDialog={hideDialog}
              colorIcon='rgb(186, 26, 26)'
            />
            <ModalDialog
              visibleModal={finishModal}
              title="Felicitaciones"
              description="Se ha modificado satisfactoriamente la informacion de perfil !"
              icon={iconModal.check}
              hideDialog={hideDialogFinish}
              colorIcon='rgba(200, 230, 201, 1)'
            />
            <View style={styles.footer}>
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={[styles.button]}
                labelStyle={styles.buttonLabel}
              >
                Modificar
              </Button>
            </View>
            <DatePicker
              isVisible={openDatePicker}
              mode={'single'}
              language='es'
              maxDate={fifteenYearsAgo}
              initialDate={fifteenYearsAgo}
              modalStyles={styles.datePickerModal}
              onConfirm={(selectedDate) => {
                console.log(selectedDate)
                setOpenDatePicker(false);
                setDate(selectedDate?.date.toISOString());
                setFieldValue('fechaNacimiento', selectedDate.dateString);
              }}
              onCancel={() => {
                setOpenDatePicker(false);
              }}
            />
          </>
        )}
      </Formik>
      {loadingSpinner && <Spinner />}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={()=>setDialogVisible(false)} style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>Selecciona una opción</Dialog.Title>
          <Dialog.Actions style={styles.dialogActions}>
            <Button onPress={openCamera} labelStyle={styles.buttonLabelCamera}>Tomar Foto</Button>
            <Button onPress={handleChooseFromGallery} labelStyle={styles.buttonLabelGallery}>Seleccionar de Galería</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    paddingBottom: 50
  },
  avatarImage: {
    backgroundColor: 'rgba(208, 208, 208, 1)'
  },
  cameraButton: {
    position: 'absolute',
    bottom: 52,
    right: 115,
    backgroundColor: 'black',
    borderRadius: 50, // Hace que el botón sea circular
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center'
  },
  dateButton: {
    marginBottom: 10,
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    position: 'relative',
    marginTop: 15
  },
  cameraButton: {
    position: 'absolute',
    top: 80,
    right: 120,
    backgroundColor: 'black',
    borderRadius: 50,
  },
  infoContainer: {
    flex: 1,
    padding: 20,
  },
  input: {
    marginBottom: 5,
    backgroundColor: 'white',
    borderColor: 'rgba(208, 208, 208, 1)',
  },
  dropdownInput: {
    display: 'flex',
    backgroundColor: 'white',
    borderColor: 'rgba(184, 184, 184, 1)',
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderTopStartRadius: 8,
    borderTopRightRadius: 8,
    borderBottomEndRadius: 8,
    height: 47,
  },
  datePickerModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    elevation: 4,
  },
  inputOutline: {
    borderColor: 'rgba(184, 184, 184, 1)',
    borderRadius: 8
  },
  footer: {
    width: '100%',
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 0,
    zIndex: 1,
    marginBottom: '3%',
  },
  disabledButton: {
    backgroundColor: 'rgba(224, 224, 224, 1)',
  },
  button: {
    width: '100%',
    backgroundColor: 'rgba(9, 44, 76, 1)',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center'
  },
  buttonLabel: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 2,
  },
  dialog: {
    backgroundColor: 'white', // Fondo blanco para el Dialog
    borderRadius: 8, // Bordes redondeados
    borderWidth: 1, // Bordes negros
    borderColor: '#000', // Color negro para el borde
},
dialogTitle: {
    color: '#2A2A2A', // Color del texto del título
    fontSize: 20,
    fontWeight: 'bold',
},
dialogActions: {
    justifyContent: 'space-evenly', // Espaciado entre los botones
    paddingBottom: 15,
},
buttonLabelGallery: {
    color: 'white',
    borderWidth:1,
    borderRadius:8,
    padding:15,
    borderColor:'#092C4C',
    backgroundColor:'#092C4C'
},

buttonLabelCamera:{
    color: '#092C4C',
    borderWidth:1,
    borderRadius:8,
    padding:15,
    borderColor:'#092C4C'
}
});