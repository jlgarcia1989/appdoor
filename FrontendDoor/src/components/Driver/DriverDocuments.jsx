import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import { Image, Linking, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Button, Dialog, IconButton, Portal, Text, TextInput } from 'react-native-paper'
import { useAuth } from '../../hooks/AuthContext';
import { requestCameraPermission } from '../../hooks/RequestPermissionCamera';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import SelectSideModal from '../../pages/SelectSideModal';
import { editUser } from '../../services/User/User';
import Spinner from '../../pages/SpinnerActivity';
import { editDriver, uploadFiles } from '../../services/Driver/Driver';
import { mapFiles } from '../../utils/Utils';
import CustomUploadModal from '../../pages/CustomUploadModal';
import ChooseSideButtons from '../../pages/ChooseSideButtons';

export default function DriverDocuments() {
    const navigation = useNavigation();
    const [avatarSource, setAvatarSource] = useState(null);
    const { user, login, updateUser, closeDrawer, openDrawer } = useAuth();
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogUpload, setDialogUpload] = useState(false);
    const [selectedDocKey, setSelectedDocKey] = useState(null);
    const [selectedSide, setSelectedSide] = useState(null);
    const [imageProfile, setImageProfile] = useState(null);
    const [sideDialogVisible, setSideDialogVisible] = useState(false);
    const [loadingSpinner, setLoadingSpinner] = useState(false);
    const [pendingSide, setPendingSide] = useState({
        identificacion: 'frente',
        pase: 'frente'
    });
    const [documentos, setDocumentos] = useState({
        identificacion: { frente: null, reverso: null },
        pase: { frente: null, reverso: null }
    });
    const [isFullyUploaded, setIsFullyUploaded] = useState({
        identificacion: false,
        pase: false
    });

    const handleSave = async () => {
        setLoadingSpinner(true);
        if (imageProfile) {
            console.log('userdriver', user)
            const updateDriver = await editDriver({ ...user, imageProfile });
            updateUser({ ...updateDriver })
        }
        await uploadFiles({
            idUsuario: user?.idUsuario,
            IdInformacionDocumento: 0,
            IdTipoDocumento: 2,
            documents: mapFiles(documentos)
        });
        setLoadingSpinner(false)
        navigation.navigate("Driver", { savedDriverDocs: true });
    };

    const handleDelete = () => {
        setDocumentos(prev => ({
            ...prev,
            [selectedDocKey]: { frente: null, reverso: null }, // Reiniciar el documento
        }));
        setPendingSide(prevState => ({
            ...prevState,
            [selectedDocKey]: 'frente', // Volver a empezar con el "frente"
        }));
        setIsFullyUploaded(prev => ({
            ...prev,
            [selectedDocKey]: false, // Reiniciar el estado de carga
        }));
    };

    const handleSelectSide = (side) => {
        setSelectedSide(side);
        setSideDialogVisible(false);
        setDialogVisible(true);
    };

    useEffect(() => {
        if (user && user?.urlImagen) {
            setAvatarSource(user.urlImagen.replace(/\\/g, '/'))
        }
    }, []);

    useEffect(() => {
        if (pendingSide && (pendingSide === 'frente' || pendingSide === 'reverso')) {
            setDialogVisible(true);
        }
    }, [pendingSide]);

    const handleChooseFromGallery = async () => {
        if (await requestCameraPermission()) {
            launchImageLibrary({ mediaType: 'photo' }, response => {
                if (response?.assets?.length) {
                    const file = response.assets[0];
                    setDocumentos(prev => {
                        const updatedDoc = {
                            ...prev[selectedDocKey],
                            [pendingSide[selectedDocKey]]: file, // Cargar el lado correcto (frente o reverso)
                        };

                        return {
                            ...prev,
                            [selectedDocKey]: updatedDoc,
                        };
                    });

                    if (pendingSide[selectedDocKey] === 'frente') {
                        setPendingSide(prevState => ({
                            ...prevState,
                            [selectedDocKey]: 'reverso',
                        }));
                    } else {
                        // Ambos lados cargados, cambiar el icono a "delete"
                        setIsFullyUploaded(prevState => ({
                            ...prevState,
                            [selectedDocKey]: true,
                        }));
                        setDialogVisible(false);
                    }


                    console.log(`Guardado ${pendingSide[selectedDocKey]} de ${selectedDocKey}:`, file);
                }
            });
        } else {
            Linking.openSettings();
        }
    };

    const openCamera = async () => {
        if (await requestCameraPermission()) {
            launchCamera({ mediaType: 'photo', cameraType: 'back' }, (response) => {
                if (response?.assets?.length) {
                    const file = response.assets[0];
                    setDocumentos(prev => {
                        const updatedDoc = {
                            ...prev[selectedDocKey],
                            [pendingSide[selectedDocKey]]: file, // Cargar el lado correcto (frente o reverso)
                        };

                        return {
                            ...prev,
                            [selectedDocKey]: updatedDoc,
                        };
                    });

                    if (pendingSide[selectedDocKey] === 'frente') {
                        setPendingSide(prevState => ({
                            ...prevState,
                            [selectedDocKey]: 'reverso',
                        }));
                    } else {
                        // Ambos lados cargados, cambiar el icono a "delete"
                        setIsFullyUploaded(prevState => ({
                            ...prevState,
                            [selectedDocKey]: true,
                        }));
                        setDialogVisible(false);
                    }




                    console.log(`Guardado ${pendingSide[selectedDocKey]} de ${selectedDocKey}:`, file);
                }
            });
        }
        else {
            Linking.openSettings();
        }
    };

    const handleChooseFromGalleryUpload = async () => {
        if (await requestCameraPermission()) {
            launchImageLibrary({ mediaType: 'photo' }, response => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                } else {
                    setAvatarSource(response.assets[0].uri);
                    setImageProfile(response.assets[0])
                }
            });
            setDialogUpload(false);
        } else {
            Linking.openSettings();
        }
    };

    const openImageUpload = async () => {
        if (await requestCameraPermission()) {
            launchCamera({ mediaType: 'photo', cameraType: 'back' }, (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                } else {
                    setAvatarSource(response.assets[0].uri);
                    setImageProfile(response.assets[0])
                }
            });
            setDialogUpload(false)
        }
        else {
            Linking.openSettings();
        }
    };



    return (

        <>

            <View style={styles.content}>
                <ScrollView contentContainerStyle={styles.container}>
                    <Image
                        source={{ uri: avatarSource }} // Reemplaza con la URL real
                        style={styles.image}
                        resizeMode="cover"
                    />

                    <Button mode="outlined" onPress={() => { setDialogUpload(true) }} style={styles.uploadButton} labelStyle={styles.uploadButtonText}>
                        Subir Imagen
                    </Button>


                    <View style={styles.inputContainer}>
                        <IconButton icon="account-outline" size={20} color="#5A5A5A" style={{ marginRight: -10 }} />
                        <TextInput
                            style={styles.inputField}
                            keyboardType="numeric"
                            placeholderTextColor='#5A5A5A'
                            mode="flat"
                            activeUnderlineColor='transparent'
                            activeOutlineColor='rgba(100, 100, 100, 1)'
                            textColor="#5A5A5A"
                            value={user?.nombre}
                            disabled={true}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <IconButton icon="card-account-mail-outline" size={20} color="#5A5A5A" style={{ marginRight: -10 }} />
                        <TextInput
                            style={styles.inputField}
                            keyboardType="numeric"
                            placeholderTextColor='#5A5A5A'
                            mode="flat"
                            activeUnderlineColor='transparent'
                            activeOutlineColor='rgba(100, 100, 100, 1)'
                            textColor="#5A5A5A"
                            value={user?.correo}
                            disabled={true}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <IconButton icon="phone-outline" size={20} color="#5A5A5A" style={{ marginRight: -10 }} />
                        <TextInput
                            style={styles.inputField}
                            keyboardType="numeric"
                            placeholderTextColor='#5A5A5A'
                            mode="flat"
                            activeUnderlineColor='transparent'
                            activeOutlineColor='rgba(100, 100, 100, 1)'
                            textColor="#5A5A5A"
                            value={user?.numeroCelular}
                            disabled={true}
                        />
                    </View>


                    <View style={styles.fileContainer}>
                        {["Documento identificación", "Pase del vehiculo"].map((label, index) => {
                            const docKey = label === "Documento identificación" ? "identificacion" : "pase";
                            return (
                                <View key={index} style={styles.fileRow}>
                                    <Text style={styles.fileLabel}>{label}</Text>
                                    <TouchableOpacity style={styles.iconWrapper}
                                        onPress={() => {
                                            if (isFullyUploaded[docKey]) {
                                                handleDelete();
                                            } else {
                                                setSelectedDocKey(docKey)
                                                setDialogVisible(true);
                                            }
                                        }}>
                                        <IconButton icon={isFullyUploaded[docKey] ? "delete-outline" : "upload-outline"}
                                            size={18}
                                            iconColor={isFullyUploaded[docKey] ? "#EB5757" : "#092C4C"} />
                                    </TouchableOpacity>
                                </View>
                            )

                        }
                        )}
                    </View>



                </ScrollView>

                <SelectSideModal
                    visible={sideDialogVisible}
                    onSelectSide={handleSelectSide}
                    onClose={() => setSideDialogVisible(false)}
                />

                <ChooseSideButtons
                    dialogVisible={dialogVisible}
                    onClose={() => setDialogVisible(false)}
                    onCamera={() => openCamera()}
                    onGallery={() => handleChooseFromGallery()}
                    selectedSide={'del ' + pendingSide[selectedDocKey]}
                />



     {/*            <Portal>
                    <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)} style={styles.dialog}>
                        <Dialog.Title style={styles.dialogTitle}>Selecciona una opción del {pendingSide[selectedDocKey] && pendingSide[selectedDocKey]}</Dialog.Title>
                        <Dialog.Actions style={styles.dialogActions}>
                            <Button onPress={openCamera} labelStyle={styles.buttonLabelCamera}>Tomar Foto</Button>
                            <Button onPress={handleChooseFromGallery} labelStyle={styles.buttonLabelGallery}>Seleccionar de Galería</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal> */}

                <CustomUploadModal
                    visible={dialogUpload}
                    onClose={() => setDialogUpload(false)}
                    onCamera={openImageUpload}
                    onGallery={handleChooseFromGalleryUpload}
                />


                {loadingSpinner &&
                    <Portal>
                        <Spinner />
                    </Portal>}
                <View style={styles.footer}>
                    <Button
                        mode="contained"
                        onPress={() => handleSave()}
                        style={[styles.button, !Object.values(isFullyUploaded).every((uploaded) => uploaded) && styles.disabledButton]}
                        labelStyle={styles.buttonLabel}
                        disabled={!Object.values(isFullyUploaded).every((uploaded) => uploaded)}
                    >
                        Guardar
                    </Button>
                </View>
            </View>

        </>
    )
}



const styles = StyleSheet.create({
    content: {
        backgroundColor: 'white',
        height: "100%"
    },
    container: {
        padding: 20,
        alignItems: "center",
        backgroundColor: 'white',
    },
    image: {
        width: "100%",
        height: 150,
        borderRadius: 8,
    },
    uploadButton: {
        width: '100%',
        borderRadius: 8,
        height: 50,
        justifyContent: 'center',
        marginVertical: 10,
        borderColor: '#092C4C'
    },
    uploadButtonText: {
        color: "#092C4C",
        fontWeight: "700",
        fontSize: 18
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'rgba(208, 208, 208, 1)',
        borderWidth: 1,
        width: '100%',
        borderRadius: 8,
        marginHorizontal: 4,
        marginTop: 8
    },
    inputField: {
        flex: 1,
        paddingLeft: 8,
        fontSize: 16,
        borderRadius: 8,
        marginRight: 10,
    },
    inputFocus: {
        borderColor: '#092C4C', // Cambia el color del borde al hacer foco
        backgroundColor: '#fff', // Mantiene el fondo blanco al hacer foco
    },
    input: {
        borderWidth: 1,
        borderColor: '#B8B8B8',
        borderRadius: 8,
        padding: 12,
        flex: 1,
        marginHorizontal: 4,
        color: '#5A5A5A'
    },
    fileContainer: {
        width: '100%',
        marginTop: 5,
        padding: 5
    },

    fileRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 5,
        paddingVertical: 8,
    },

    fileLabel: {
        fontSize: 16,
        color: "#333333",
        flex: 1,
    },

    iconWrapper: {
        borderWidth: 1,
        borderColor: '#092C4C',
        borderRadius: 5
    },
    documentContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        backgroundColor: "#F8F8F8",
        borderRadius: 8,
        padding: 12,
        marginVertical: 5,
        borderColor: "#DDD",
        borderWidth: 1,
    },
    documentText: {
        flex: 1,
        color: "#000",
    },
    footer: {
        width: '100%',
        paddingHorizontal: 20,
        position: 'absolute',
        bottom: 0,
        zIndex: 1,
        marginBottom: '3%'
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
        fontWeight: 'bold'
    },
    disabledButton: {
        backgroundColor: 'rgba(224, 224, 224, 1)',
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
        borderWidth: 1,
        borderRadius: 8,
        padding: 15,
        borderColor: '#092C4C',
        backgroundColor: '#092C4C'
    },

    buttonLabelCamera: {
        color: '#092C4C',
        borderWidth: 1,
        borderRadius: 8,
        padding: 15,
        borderColor: '#092C4C'
    }
})
