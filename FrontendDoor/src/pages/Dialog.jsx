import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import { Button, Dialog, IconButton, Portal } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native';


export default function ModalDialog({
  visibleModal,
  title,
  description,
  icon,
  hideDialog,
  colorIcon,
  textButton
}) {

  const navigation = useNavigation();
  return (
    <Portal>
      <Dialog
        visible={visibleModal}
        onDismiss={hideDialog}
        style={styles.dialog}>
        <Dialog.Icon icon={icon} size={80} color={colorIcon} />
        <IconButton
          icon="close"
          size={24}
          onPress={()=>hideDialog(false)}
          style={styles.closeButton}
          iconColor="black"
        />
        <Dialog.Title style={styles.title}>{title}</Dialog.Title>
        <Dialog.Content style={{ marginBottom: 20 }}>
          <Text style={styles.description}>{description}</Text>
        </Dialog.Content>
        <Dialog.Actions style={styles.dialogActions}>
          <Button style={styles.button} onPress={() => {
            if(textButton){
              navigation.navigate('Reservas')
            }
            hideDialog(true)
          }
          } labelStyle={styles.buttonText}>
            {textButton ? textButton : 'Aceptar'}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: 'white',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black'
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