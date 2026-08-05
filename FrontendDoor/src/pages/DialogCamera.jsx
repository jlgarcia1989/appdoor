import React, { useState } from 'react';
import { Dialog, Button } from 'react-native-paper';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { StyleSheet } from 'react-native';

const ChooseImageDialog = ({ visible, onDismiss, index, setImageUris }) => {
    // Función para abrir la cámara
    const openCamera = () => {
        launchCamera({ mediaType: 'photo', cameraType: 'back' }, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                const newImageUri = response.assets[0].uri;
                setImageUris((prevUris) => {
                    const updatedUris = [...prevUris];
                    updatedUris[index] = newImageUri;
                    return updatedUris;
                });
                console.log(response.assets[0]);
                onDismiss(); // Cerrar el diálogo después de tomar la foto
            }
        });
    };

    // Función para abrir la galería
    const openGallery = () => {
        launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                const newImageUri = response.assets[0].uri;
                setImageUris((prevUris) => {
                    const updatedUris = [...prevUris];
                    updatedUris[index] = newImageUri;
                    return updatedUris;
                });
                console.log(response.assets[0]);
                onDismiss();
            }
        });
    };

    return (
        <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
            <Dialog.Title style={styles.dialogTitle}>Selecciona una opción</Dialog.Title>
            <Dialog.Actions style={styles.dialogActions}>
                <Button onPress={openCamera} labelStyle={styles.buttonLabelCamera}>Tomar Foto</Button>
                <Button onPress={openGallery} labelStyle={styles.buttonLabel}>Seleccionar de Galería</Button>
            </Dialog.Actions>
        </Dialog>
    );
};

const styles = StyleSheet.create({
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
    button: {
        backgroundColor: '#2196F3',
        borderRadius: 4,
        marginHorizontal: 10,
    },
    buttonLabel: {
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

export default ChooseImageDialog;