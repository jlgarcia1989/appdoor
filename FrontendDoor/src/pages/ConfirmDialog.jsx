import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Button, Dialog, IconButton, Portal } from 'react-native-paper';

export default function ConfirmCancelDialog({
  visibleModal,
  title,
  description,
  icon,
  hideDialog,
  colorIcon,
  confirmAction
}) {
  
  return (
      <Dialog
        visible={visibleModal}
        onDismiss={hideDialog}
        style={styles.dialog}
      >
        <Dialog.Icon icon={icon} size={80} color={colorIcon} />
        <IconButton
          icon="close"
          size={24}
          onPress={hideDialog}
          style={styles.closeButton}
          iconColor="black"
        />
        <Dialog.Title style={styles.title}>{title}</Dialog.Title>
        <Dialog.Content style={{ marginBottom: 20 }}>
          <Text style={styles.description}>{description}</Text>
        </Dialog.Content>
        <Dialog.Actions style={styles.dialogActions}>
          <Button
            style={[styles.button, styles.cancelButton]}
            onPress={hideDialog}
            labelStyle={styles.buttonTextCancel}
          >
            Cancelar
          </Button>
          <Button
            style={styles.button}
            onPress={() => {
              confirmAction();
              hideDialog();
            }}
            labelStyle={styles.buttonText}
          >
            Aceptar
          </Button>
        </Dialog.Actions>
      </Dialog>
  );
}

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius:8
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
  },
  description: {
    color: 'black',
    textAlign:'center'
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  dialogActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#092C4C',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 2,
  },
  cancelButton: {
    backgroundColor: 'white',
    borderRadius:8,
    borderColor:"#092C4C",
    borderWidth:1
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
  buttonTextCancel: {
    fontSize: 18,
    color: '#092C4C',
  },
});
