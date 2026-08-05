import React, { useEffect, useRef, useState } from 'react';
import { Linking, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Avatar, Button, Chip, IconButton, MD3Colors, Modal, Portal, TextInput, Provider as PaperProvider, DefaultTheme, shadow, Text } from 'react-native-paper'; // Importa componentes de React Native Paper
import { useNavigation, useRoute } from '@react-navigation/native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { requestCameraPermission } from '../../hooks/RequestPermissionCamera';
import { Formik } from 'formik';
import * as yup from 'yup';
import { ScrollView } from 'react-native-gesture-handler';
import ModalDialog from '../../pages/Dialog';
import { iconModal } from '../../utils/Icons';
import { useAuth } from '../../hooks/AuthContext';
import { createUser } from '../../services/User/User';
import Spinner from '../../pages/SpinnerActivity';

import DatePicker from 'react-native-neat-date-picker'


const Profile = () => {
    const navigation = useNavigation();
    const [avatarSource, setAvatarSource] = useState(null); // Estado para almacenar la imagen seleccionada
    const [modalVisible, setModalVisible] = useState(false); // Estado para controlar la visibilidad del modal
    const [showDropDown, setShowDropDown] = useState(false);
    const [visibleModal, setVisibleModal] = useState(false);
    const [finishModal, setFinishModal] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [loadingSpinner, setLoadingSpinner] = useState(false);
    const [typesUsers, setTypesUsers] = useState([]);
    const [date, setDate] = useState(null);
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const [textModal, setTextModal] = useState("Debes completar todos los campos requeridos");
    const route = useRoute();
    const { isEdit } = route.params;
    const { user, login, updateUser } = useAuth();
    const [imageProfile, setImageProfile] = useState(null);

    const today = new Date();
    const fifteenYearsAgo = new Date(today.setFullYear(today.getFullYear() - 15));

    useEffect(() => {
        requestCameraPermission();
    }, []);

    const hideDialog = () => {
        setTextModal("Debes completar todos los campos requeridos")
        setVisibleModal(false)
    }

    const hideDialogFinish = () => {
        setFinishModal(false)
    }

    const initialValues = {
        name: '',
        lastName: '',
        fechaNacimiento: '',
        numeroIdentificacion: '',
        correo: '',
        direccion: ''
    };

    const theme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            primary: 'black',
            text: 'black',   // Cambia el color del texto
            background: 'white',
            shadow: 'rgba(208, 208, 208, 1)'
        },
        fonts: {
            regular: {
                fontFamily: 'Roboto',
                fontWeight: 'normal',
            },
        }
    };

    // Función para manejar la selección de imagen desde la galería
    const handleChooseFromGallery = async () => {
        if (await requestCameraPermission()) {
            launchImageLibrary({ mediaType: 'photo' }, response => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                } else {
                    setAvatarSource({ uri: response.assets[0].uri });
                    setImageProfile(response.assets[0])
                    setModalVisible(false); // Cierra el modal después de seleccionar una imagen
                }
            });
        } else {
            Linking.openSettings();
        }
    };

    // Función para manejar la toma de foto con la cámara
    const handleTakePhoto = () => {
        launchCamera({ mediaType: 'photo' }, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                setAvatarSource({ uri: response.assets[0].uri });
                setModalVisible(false); // Cierra el modal después de tomar una foto
            }
        });

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
        numeroIdentificacion: yup.string().trim().required('Ingrese su cédula'),
        correo: yup.string()
            .trim()
            .required('Ingrese su correo electrónico')
            .email('Ingrese un correo electrónico válido'),
        fechaNacimiento: yup.string().trim().required('Ingrese su fecha de nacimiento')
        .test('is-over-18', 'Debe tener al menos 18 años', function(value) {
            const today = new Date();
            const birthDate = new Date(value);
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            // Resta 1 de la edad si el mes de nacimiento es posterior al mes actual o si es el mismo mes pero la fecha de nacimiento es posterior
            const calculatedAge = (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) ? age - 1 : age;
    
            return calculatedAge >= 18
        }),
        direccion: yup.string().trim().required('Ingrese su direccion'),
    });

    const handleSubmit = async (values) => {
        try {
            await validationSchema.validate(values, { abortEarly: false });
            setLoadingSpinner(true)
            const create = await createUser({ ...values, imageProfile, phoneNumber: user?.phoneNumber })
            if (create) {
                setFinishModal(true)
                updateUser({
                    ...user,
                    ...create
                })
                setTimeout(() => {
                    navigation.navigate('Home')
                    setFinishModal(false)
                }, 3000);
                setLoadingSpinner(false)
            } else {
                setTextModal('Ha ocurrido un error al guardar el usuario')
                setVisibleModal(true)
                setLoadingSpinner(false)
            }
        } catch (errors) {
            console.log('errors', errors)
            console.log(errors.inner.map((error) => error.message));
            if (errors.inner.length === 1 && errors.inner.find((e) => e.message === 'Ingrese un correo electrónico válido')) {
                setTextModal('Ingrese un correo electrónico válido')
            }
        }
    };

    return (
        <View style={styles.container}>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                >
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
                                    source={avatarSource}
                                />
                                <IconButton
                                    icon="camera-outline"
                                    iconColor={MD3Colors.neutralVariant99}
                                    size={15}
                                    mode='outlined'
                                    style={styles.cameraButton}
                                    onPress={handleChooseFromGallery}
                                />
                            </View>
                            <View style={styles.infoContainer}>
                                <TextInput
                                    label="Nombres"
                                    mode="outlined"
                                    activeOutlineColor='rgba(100, 100, 100, 1)'
                                    textColor="black"
                                    style={styles.input}
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
                                    error={touched.name && errors.name ? true : false} 
                                />
                                {touched.name && errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
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
                                    error={touched.lastName && errors.lastName ? true : false} 
                                />
                                {touched.lastName && errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
                                {/* 
                                    <DropDown
                                        mode="undefined"
                                        visible={showDropDown}
                                        dropDownItemSelectedTextStyle={{ color: 'rgba(100, 100, 100, 1)' }}
                                        activeColor='black'
                                        placeholder='Tipo de usuario'
                                        showDropDown={() => setShowDropDown(true)}
                                        onDismiss={() => setShowDropDown(false)}
                                        value={values.idTipoUsuario}
                                        theme={theme}
                                        setValue={(value) => setFieldValue('idTipoUsuario', value)}
                                        list={typesUsers}
                                        inputProps={{
                                            right: <TextInput.Icon name="menu-down" />,
                                            style: [styles.dropdownInput],
                                        }}
                                    />
                                                                        <DropDown
                                        mode="undefined"
                                        visible={showDropDown}
                                        dropDownItemSelectedTextStyle={{ color: 'rgba(100, 100, 100, 1)' }}
                                        activeColor='black'
                                        placeholder='Tipo de Cédula'
                                        showDropDown={() => setShowDropDown(true)}
                                        onDismiss={() => setShowDropDown(false)}
                                        value={values.idType}
                                        theme={theme}
                                        setValue={(value) => setFieldValue('idType', value)}
                                        list={[
                                            { label: 'Cédula de ciudadanía', value: 'cc' },
                                            { label: 'Cédula de extranjería', value: 'ce' },
                                            { label: 'Pasaporte', value: 'passport' },
                                        ]}
                                        inputProps={{
                                            right: <TextInput.Icon name="menu-down" />,
                                            style: [styles.dropdownInput],
                                        }}
                                    /> */}
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
                                    error={touched.numeroIdentificacion && errors.numeroIdentificacion ? true : false} 
                                />
                                 {touched.numeroIdentificacion && errors.numeroIdentificacion && <Text style={styles.errorText}>{errors.numeroIdentificacion}</Text>}
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
                                        value={date ? date : ''}
                                        showSoftInputOnFocus={false}
                                        editable={false}
                                        error={touched.fechaNacimiento && errors.fechaNacimiento ? true : false} 
                                    />
                                     {touched.fechaNacimiento && errors.fechaNacimiento && <Text style={styles.errorText}>{errors.fechaNacimiento}</Text>}
                                </TouchableOpacity>

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
                                    value={user?.phoneNumber}
                                    maxLength={10}
                                />
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
                            description="Su cuenta está lista para usar. Serás redirigido a la página de inicio en unos segundos."
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
                                Terminar
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
                                setOpenDatePicker(false);
                                setDate(selectedDate?.dateString);
                                setFieldValue('fechaNacimiento', selectedDate.date.toISOString());
                            }}
                            onCancel={() => {
                                setOpenDatePicker(false);
                            }}
                        />
                    </>
                )}
            </Formik>
            {loadingSpinner && (
                <Spinner />
            )}
        </View>
    );
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
});

export default Profile;
