import { ImageBackground, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Button, Checkbox, Text } from 'react-native-paper';
import PhoneInput from 'react-native-international-phone-number';
import { Formik,FormikErrors, FormikValues } from 'formik';
import * as yup from 'yup';
import ModalDialog from '../../pages/Dialog';
import { iconModal } from '../../utils/Icons';
import useOneSignal, { validatePermission } from '../../hooks/useOneSignal';
import { useAuth } from '../../hooks/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { termsAndConditions } from '../../utils/TermsAndConditions';
import ModalTerms from '../../pages/ModalTerms';
import { generateCode } from '../../utils/Utils';
import { generateCodeAndNotification, getData, sendNotificacion } from '../../services/Notifications/sendNotification';
import { OneSignal } from 'react-native-onesignal';
import Spinner from '../../pages/SpinnerActivity';
import { disabledUser, userExist } from '../../services/User/User';

const Login = () => {
  const [value, setValue] = useState("");
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleModalAccount, setVisibleModalAccount] = useState(false);
  const [visibleModalTerms, setVisibleModalTerms] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [checked, setChecked] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [btnNext,setBtnNext]=useState(false);
  const { updateUser, user  } = useAuth();
  const navigation = useNavigation();

  //Iniciar permiso de notificacion
  useOneSignal()

  const initialValues = {
    phoneNumber: '',
    acceptedTerms: checked,
  };

  const hideDialog = () => setVisibleModal(false);

  const activeAccount = async (accept) => {
    if(accept){
      await disabledUser(user.idUsuario,true);
    }
    setVisibleModalAccount(false)
  } 
  
  const hideDialogTerms = () => {
    setVisibleModalTerms(false);
  } 
  
  const handleVerify = async (phoneNumber) => {
      const verifyUser = await userExist(phoneNumber?.replace(/\s+/g, ''));
      console.log('::.verifyUser',verifyUser)
      updateUser({...verifyUser})
      if(verifyUser && !verifyUser.activo){
        setVisibleModalAccount(true)
      }else{
        const notification = await generateCodeAndNotification(phoneNumber?.replace(/\s+/g, ''))
        if(notification?.notification){
          updateUser({phoneNumber:phoneNumber?.replace(/\s/g, '')})
          await navigation.navigate('CodeVerify',{code:notification.code.toString()});
        }
      }
    
  };

  const handleTermsClick = () =>{
    setVisibleModalTerms(true)
  }

 const handleInputValue = (phoneNumber) => {
   setInputValue(
     selectedCountry?.cca2 != 'CO'
       ? phoneNumber
       : phoneNumber.startsWith('3')
       ? phoneNumber
       : '',
   );
 };

  function handleSelectedCountry(country) {
    setSelectedCountry(country);
  }

  const validationSchema = yup.object().shape({
    phoneNumber: yup.string()
      .required('Ingrese su número de teléfono')
      .test('isTenDigits', 'El número de teléfono debe contener exactamente 10 dígitos', function (value) {
        const digits = value.replace(/\D/g, '');
        return digits.length === 10;
      })
      .test('startsWith3', '', function (value) {
        const digits = value.replace(/\D/g, '');
        if (selectedCountry && selectedCountry.cca2 === 'CO') {
          return digits.startsWith('3');
        }
        return true;
      }),
    acceptedTerms: yup.boolean().oneOf([true], 'Debe aceptar los términos y condiciones'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setBtnNext(true)
      await validationSchema.validate(values, { abortEarly: false });
      if (await validatePermission()) {
        setValue(values.phoneNumber?.replace(/\s+/g, ''))
        await handleVerify(values.phoneNumber)
      }
    } catch (errors) {
      console.log(errors.inner.map((error) => error.message));
      setVisibleModal(true);
    }
    setSubmitting(false)
    setBtnNext(false)
  };


  return (
    <View style={styles.container}>
      <Formik
        initialValues={initialValues}
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
            <View style={styles.header}>
              <Text style={styles.headerText}>Ingrese numero de teléfono</Text>
            </View>
            <View style={styles.phoneInputContainer}>
              <PhoneInput
                value={inputValue}
                onChangePhoneNumber={phoneNumber => {
                  handleChange('phoneNumber')(phoneNumber);
                  handleInputValue(phoneNumber);
                }}
                selectedCountry={selectedCountry}
                onChangeSelectedCountry={country => {
                  handleSelectedCountry(country);
                }}
                style={styles.phoneInput}
                phoneInputStyles={{flagContainer: {backgroundColor: 'white'}}}
                defaultCountry="CO"
                placeholder="Numero de teléfono"
                modalStyles={{
                  countryName: styles.countryText,
                  searchInput: {color: 'black'},
                }}
                modalSearchInputPlaceholder="Busca el pais"
              />
            </View>
            <View style={styles.checkboxContainer}>
              <Checkbox
                status={values.acceptedTerms ? 'checked' : 'unchecked'}
                onPress={() => {
                  setFieldValue('acceptedTerms', !values.acceptedTerms);
                }}
                color="green"
              />
              <Text style={styles.textPolitics} onPress={handleTermsClick}>
                Al registrarse, usted acepta los
                <Text style={styles.link}> términos de servicio </Text>
                y la
                <Text style={styles.link}> política de privacidad.</Text>
              </Text>
            </View>
            <View style={styles.footer}>
              <Button
                mode="contained"
                onPress={async () => {
                  await handleSubmit(); // Envía el formulario
                }}
                style={styles.button}
                labelStyle={styles.buttonLabel}
                disabled={isSubmitting}
                loading={isSubmitting}
                >
                Siguiente
              </Button>
            </View>
            <ModalDialog
              visibleModal={visibleModal}
              title="Ups!"
              description="Debes completar todos los campos requeridos"
              icon={iconModal.alert}
              hideDialog={hideDialog}
              colorIcon='rgb(186, 26, 26)'
            />
            <ModalTerms
              visibleModal={visibleModalTerms}
              title="Política de privacidad para viajes compartidos"
              description={termsAndConditions}
              hideDialog={hideDialogTerms}
            />
          </>
        )}
      </Formik>
      {btnNext && (
        <Spinner />
      )}
      <ModalDialog
          colorIcon='yellow'
          description='Deseas activar tu cuenta?'
          hideDialog={(acept)=>activeAccount(acept)}
          icon={iconModal.alert}
          title='Estas seguro!'
          visibleModal={visibleModalAccount}

        />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingVertical:20,
    backgroundColor:'white'
  },
  header: {
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 18,
    color:'black'
  },
  phoneInputContainer: {
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  phoneInput: {
    width: '100%',
    borderRadius:5,
    color:'black'
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  textPolitics:{
    color: '#7D7C7A',
    paddingHorizontal:30,
  },
  link: {
    textDecorationLine: 'none',
    color: 'rgba(254, 196, 0, 1)',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center'
  },
  button: {
    backgroundColor: 'rgba(9, 44, 76, 1)',
    borderRadius: 8,
    height: 50,
    justifyContent:'center',
    width: '100%'
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  countryText: {
    color: 'black'
  },
  checkbox: {
    borderWidth: 1, // Añadimos borde al checkbox
    borderColor: 'green', // Color del borde del checkbox
    borderRadius: 5, // Radio de borde del checkbox
    marginRight: 10, // Margen derecho para separar el checkbox del texto
  },
  errorText: {
    color: 'red',
    fontSize: 14
  },
});

export default Login;