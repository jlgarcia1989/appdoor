import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from 'react-native'
import React from 'react'
import { Button, Dialog, IconButton, Portal } from 'react-native-paper'


export default function ModalTerms({
    visibleModal,
    title,
    description,
    hideDialog,
}) {

    const window = useWindowDimensions();
    const minHeight = 100; // Altura mínima del contenido
    const maxHeight = window.height * 0.44; // Máximo 80% del alto de la ventana
    const contentHeight = Math.min(maxHeight, Math.max(minHeight, description ? description.length * 2 : minHeight));

    return (
        <Portal>
            <Dialog
                visible={visibleModal}
                onDismiss={hideDialog}
                style={styles.dialog}>
                <Dialog.Title style={styles.title}>{title}</Dialog.Title>
                <Dialog.Content style={[styles.content, { height: contentHeight }]}>
                    <ScrollView contentContainerStyle={styles.scrollView}>
                        <Text style={styles.description}>{description}</Text>
                    </ScrollView>
                </Dialog.Content>
                <Dialog.Actions style={styles.dialogActions}>
                    <Button style={styles.button} onPress={() => hideDialog()} labelStyle={styles.buttonText}>
                        Aceptar
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}

const styles = StyleSheet.create({
    dialog: {
        backgroundColor: 'white',
        alignItems: 'center'
    },
    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'black',
        fontSize: 18,
        lineHeight:22
    },
    content: {
        paddingHorizontal: 10,
        margin: 10
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: 'center'
    },
    description: {
        color: 'black',
    },
    closeButton: {
        position: 'absolute',
        top: 5,
        right: 5
    },
    dialogActions: {
        fontSize: 50
    },
    button: {
        backgroundColor: 'rgba(9, 44, 76, 1)',
        borderRadius: 8,
        height: 50,
        justifyContent: 'center',
        width: '100%',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
});