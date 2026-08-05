import React from 'react';
import { Dialog, Portal, Button } from 'react-native-paper';
import { StyleSheet, Text } from 'react-native';


const SelectSideModal = ({ visible, onSelectSide, onClose }) => {
    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onClose} style={styles.dialog}>
                <Dialog.Title style={styles.dialogTitle}>¿Qué lado deseas subir?</Dialog.Title>
                <Dialog.Actions style={styles.dialogActions}>
                    <Button
                        onPress={() => {
                            onSelectSide("frente");
                            onClose();
                        }}
                        labelStyle={styles.buttonLabelGallery}
                    >
                        Frente
                    </Button>
                    <Button
                        onPress={() => {
                            onSelectSide("reverso");
                            onClose();
                        }}
                        labelStyle={styles.buttonLabelCamera}
                    >
                        Reverso
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

const styles = StyleSheet.create({
    dialog: {
        backgroundColor: 'white', // Fondo blanco para el Dialog
        borderRadius: 8, // Bordes redondeados
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
        width: 120,
        color: 'white',
        borderWidth: 1,
        borderRadius: 8,
        padding: 15,
        borderColor: '#092C4C',
        backgroundColor: '#092C4C'
    },

    buttonLabelCamera: {
        width: 120,
        color: '#092C4C',
        borderWidth: 1,
        borderRadius: 8,
        padding: 15,
        borderColor: '#092C4C'
    }
});

export default SelectSideModal;