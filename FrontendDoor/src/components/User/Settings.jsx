import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon, MD3Colors } from 'react-native-paper';
import ModalTerms from '../../pages/ModalTerms';
import { termsAndConditions } from '../../utils/TermsAndConditions';
import ModalDialog from '../../pages/Dialog';
import { iconModal } from '../../utils/Icons';
import FormDialog from '../../pages/FormDialog';
import { disabledUser } from '../../services/User/User';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/AuthContext';

const Settings = () => {
  const navigation = useNavigation();
  const { user, login } = useAuth();
  const [visibleModalTerms, setVisibleModalTerms] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleFormModal, setVisibleFormModal] = useState(false);

  const handleTermsClick = () => {
    setVisibleModalTerms(true)
  }

  const hideDialogTerms = () => {
    setVisibleModalTerms(false);
  }

  const handleDialogClick = () => {
    setVisibleModal(true)
  }

  const hideDialog = async (accept) => {
    if(accept){
      const userActive = await disabledUser(user?.idUsuario,false);
      navigation.navigate('Login')
    }
    setVisibleModal(false);
  }

  const handleFormDialogClick = () => {
    setVisibleFormModal(true)
  }

  const hideFormDialog = () => {
    setVisibleFormModal(false);
  }


  return (
    <View style={styles.container}>
      <>
        <Text style={styles.header}>Configuración</Text>
        <TouchableOpacity style={styles.option} onPress={handleTermsClick}>
          <Text style={styles.optionText}>Política de privacidad</Text>
          <Icon
            source="arrow-right-thick"
            color='#414141'
            size={20}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={handleFormDialogClick}>
          <Text style={styles.optionText}>Contáctenos</Text>
          <Icon
            source="arrow-right-thick"
            color='#414141'
            size={20}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={handleDialogClick}>
          <Text style={styles.optionText}>Eliminar Cuenta</Text>
          <Icon
            source="arrow-right-thick"
            color='#414141'
            size={20}
          />
        </TouchableOpacity>
        <ModalTerms
          visibleModal={visibleModalTerms}
          title="Política de privacidad para viajes compartidos"
          description={termsAndConditions}
          hideDialog={hideDialogTerms}
        />
        <ModalDialog
          colorIcon='red'
          description='Confirmas eliminar tu cuenta?'
          hideDialog={(acept)=>hideDialog(acept)}
          icon={iconModal.alert}
          title='Estas seguro!'
          visibleModal={visibleModal}

        />

        <FormDialog
          hideDialog={hideFormDialog}
          title='Contactenos'
          visibleModal={visibleFormModal}
        />
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#414141'
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#092C4C',
    marginBottom: 10,
  },
  optionText: {
    fontSize: 14,
    color: '#414141',
  },
});

export default Settings;
