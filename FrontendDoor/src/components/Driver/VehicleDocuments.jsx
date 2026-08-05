import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react'
import { Image, Linking, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker';
import { Button, Dialog, IconButton, Menu, Portal, Text } from 'react-native-paper'
import { requestCameraPermission } from '../../hooks/RequestPermissionCamera';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { uploadFiles } from '../../services/Driver/Driver';
import { mapFiles, mapFilesDriver } from '../../utils/Utils';
import { useAuth } from '../../hooks/AuthContext';
import Spinner from '../../pages/SpinnerActivity';
import CustomUploadModal from '../../pages/CustomUploadModal';
import ChooseSideButtons from '../../pages/ChooseSideButtons';

export default function VehicleDocuments() {
    const navigation = useNavigation();
    const [open, setOpen] = useState(false);
    const [vehicleType, setVehicleType] = useState(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const { user, login, updateUser, closeDrawer, openDrawer } = useAuth();
    const [selectedLabel, setSelectedLabel] = useState(null);
    const [isFormValid, setIsFormValid] = useState(false);
    const [selectedSide, setSelectedSide] = useState('frente');
    const [loadingSpinner, setLoadingSpinner] = useState(false);
    const [dialogUpload, setDialogUpload] = useState(false);
    const [isFullyUploaded, setIsFullyUploaded] = useState({
        "Tarjeta de propiedad": false,
        "SOAT": false,
        "Tecnomecánica": false
    });
    const [documentFiles, setDocumentFiles] = useState({
        "Tarjeta de propiedad": { frente: null, reverso: null },
        "SOAT": null,
        "Tecnomecánica": null
    });
    const [images, setImages] = useState([
        null
    ]);
    const [placa, setPlaca] = useState('');
    const [licencia, setLicencia] = useState('');
    const [vehicleOptions, setVehicleOptions] = useState([
        { label: 'Carro', value: 'carro' },
        { label: 'Moto', value: 'moto' },
        { label: 'Camioneta', value: 'camioneta' },
    ]);

    useEffect(() => {
        const valid =
            images.some(img => img) &&
            documentFiles["Tarjeta de propiedad"]?.frente &&
            documentFiles["Tarjeta de propiedad"]?.reverso &&
            documentFiles["SOAT"] &&
            documentFiles["Tecnomecánica"] &&
            placa.trim() !== '' &&
            licencia.trim() !== '' &&
            vehicleType;

        setIsFormValid(valid);
    }, [images, documentFiles, placa, licencia, vehicleType]);

    const handleSave = async () => {
        setLoadingSpinner(true)
        await uploadFiles({
            idUsuario: user?.idUsuario,
            IdInformacionDocumento: 0,
            IdTipoDocumento: 2,
            placa,
            licencia,
            tipovehiculo: vehicleOptions,
            documents: mapFilesDriver(documentFiles)
        });
        setLoadingSpinner(false)
        navigation.navigate("Driver", { savedVehicleDocs: true });
    };

    const handlePlacaChange = (text) => {
        const formatted = text.toUpperCase().replace(/\s/g, '');
        setPlaca(formatted);
    };

    const handleFileUpload = (label, side = 'frente', file) => {
        let updatedFiles
        setDocumentFiles(prev => {
            if (label === "Tarjeta de propiedad") {
                updatedFiles = {
                    ...prev,
                    [label]: {
                        ...prev[label],
                        [side]: file
                    }
                };

                const bothSides = updatedFiles[label]?.frente && updatedFiles[label]?.reverso;
                setIsFullyUploaded(prevStatus => ({
                    ...prevStatus,
                    [label]: !!bothSides
                }));

                console.log(',,,', isFormValid)

                if (side === 'frente' && !updatedFiles[label]?.reverso) {
                    setTimeout(() => {
                        setSelectedLabel(label);
                        setSelectedSide('reverso');
                        setDialogVisible(true);
                    }, 300);
                }
            } else {
                updatedFiles = {
                    ...prev,
                    [label]: file
                };
                setIsFullyUploaded(prevStatus => ({
                    ...prevStatus,
                    [label]: !!file
                }));
            }
            return updatedFiles;
        });
    };

    const handleDelete = (label) => {
        setDocumentFiles(prev => ({
            ...prev,
            [label]: label === "Tarjeta de propiedad" ? { frente: null, reverso: null } : null
        }));

        setIsFullyUploaded(prev => ({
            ...prev,
            [label]: false
        }));
    };


    const handleChooseFromGallery = async () => {
        if (await requestCameraPermission()) {
            launchImageLibrary({ mediaType: 'photo' }, response => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                } else {
                    const asset = response.assets?.[0];
                    if (asset) {
                        handleFileUpload(selectedLabel, selectedSide, asset);
                        setDialogVisible(false);
                    }
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
                    const asset = response.assets?.[0];
                    console.log(asset)
                    if (asset) {
                        handleFileUpload(selectedLabel, selectedSide, asset);
                        setDialogVisible(false);
                    }
                }
            });
            setDialogVisible(false)
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
                    console.log(response.assets)
                    setImages([response.assets[0]]);
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
                    setImages([response.assets[0]]);
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


            <View style={styles.container}>
                <ScrollView>



                    {images.map((img, index) => (
                        <TouchableOpacity key={index} style={styles.imagePlaceholder}>
                            {img ? (
                                <Image source={{ uri: img?.uri }} style={styles.image} />
                            ) : (
                                <IconButton icon="file-image-outline" size={40} color="#A0A0A0" />
                            )}
                        </TouchableOpacity>
                    ))}
                    <Button mode="outlined" onPress={() => setDialogUpload(true)} style={styles.uploadButton} labelStyle={styles.uploadButtonText}>
                        Subir Imagen
                    </Button>

                    <TextInput
                        style={styles.input}
                        placeholder="Placa"
                        placeholderTextColor="#D0D0D0"
                        value={placa}
                        onChangeText={handlePlacaChange}
                        maxLength={6}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Licencia Ej: C1,C2..."
                        placeholderTextColor="#D0D0D0"
                        value={licencia}
                        onChangeText={setLicencia}
                        maxLength={2}
                    />

                    <DropDownPicker
                        placeholder="Tipo de vehiculo"
                        open={open}
                        value={vehicleType}
                        items={vehicleOptions}
                        setOpen={setOpen}
                        setValue={setVehicleType}
                        setItems={setVehicleOptions}
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownContainer}
                        zIndex={1000}
                        placeholderStyle={{ color: '#D0D0D0' }}
                    />

                    <View style={styles.fileContainer}>
                        {["Tarjeta de propiedad", "SOAT", "Tecnomecánica"].map((label, index) => {
                            return (
                                <View key={index} style={styles.fileRow}>
                                    <Text style={styles.fileLabel}>{label}</Text>
                                    <TouchableOpacity style={styles.iconWrapper}
                                        onPress={() => {
                                            if (isFullyUploaded[label]) {
                                                handleDelete(label);
                                            } else {
                                                console.log(label)
                                                setSelectedLabel(label)
                                                if (label === "Tarjeta de propiedad") {
                                                    setSelectedSide("frente"); // solo pedimos el frente
                                                } else {
                                                    setSelectedSide("frente");
                                                }
                                                setDialogVisible(true);
                                            }
                                        }}>
                                        <IconButton
                                            icon={isFullyUploaded[label] ? "trash-can-outline" : "upload-outline"}
                                            size={18}
                                            iconColor={isFullyUploaded[label] ? "#EB5757" : "#092C4C"} />
                                    </TouchableOpacity>
                                </View>
                            )
                        })}
                    </View>
{/* 
                    <Portal>
                        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)} style={styles.dialog}>
                            <Dialog.Title style={styles.dialogTitle}>Selecciona una opción {selectedLabel === 'Tarjeta de propiedad' ? 'del ' + selectedSide : ''}</Dialog.Title>
                            <Dialog.Actions style={styles.dialogActions}>
                                <Button onPress={openCamera} labelStyle={styles.buttonLabelCamera}>Tomar Foto</Button>
                                <Button onPress={handleChooseFromGallery} labelStyle={styles.buttonLabelGallery}>Seleccionar de Galería</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal> */}

                    <ChooseSideButtons
                        dialogVisible={dialogVisible}
                        onClose={() => setDialogVisible(false)}
                        onCamera={() => openCamera()}
                        onGallery={() => handleChooseFromGallery()}
                        selectedSide={selectedLabel === 'Tarjeta de propiedad' ? 'del ' + selectedSide : ''}
                    />


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
                </ScrollView>
            </View>
            <View style={styles.footer}>
                <Button
                    mode="contained"
                    onPress={() => handleSave()}
                    style={[styles.button, !isFormValid && styles.disabledButton]}
                    labelStyle={styles.buttonLabel}
                    disabled={!isFormValid}
                >
                    Guardar
                </Button>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    containerScroll: {
        padding: 20,
        alignItems: "center",
        backgroundColor: 'white',
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        backgroundColor: "white"
    },
    imagePlaceholder: {
        width: '100%',
        aspectRatio: 2.6,
        backgroundColor: "#F5F5F5",
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center"
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
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
    input: {
        height: 50,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        color: "#323232",
        borderColor: '#B8B8B8',
        borderWidth: 1
    },
    dropdown: {
        borderColor: '#B8B8B8',
        borderRadius: 8,
        height: 50,
        marginBottom: 20,
    },
    dropdownContainer: {
        borderColor: '#B8B8B8',
        borderRadius: 8,
    },
    fileContainer: {
        marginBottom: 20,
        paddingHorizontal: 10
    },
    fileRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10
    },
    fileLabel: {
        fontSize: 16,
        color: "#333333"
    },
    iconWrapper: {
        borderWidth: 1,
        borderColor: '#092C4C',
        borderRadius: 5
    },
    footer: {
        width: '100%',
        paddingHorizontal: 20,
        position: 'absolute',
        bottom: 0,
        zIndex: 1,
        marginBottom: '3%'
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
        fontWeight: 'bold'
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
