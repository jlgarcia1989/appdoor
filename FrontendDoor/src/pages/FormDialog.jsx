import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import { Button, Dialog, IconButton, Portal, TextInput } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native';
import PhoneInput from 'react-native-international-phone-number';
import { Formik } from 'formik';
import * as yup from 'yup';
import ModalDialog from './Dialog';
import { iconModal } from '../utils/Icons';


export default function FormDialog({
    visibleModal,
    title,
    description,
    icon,
    hideDialog,
    colorIcon,
    textButton
}) {

    const navigation = useNavigation();
    const [inputValue, setInputValue] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [visibleModalRequired, setVisibleModalRequired] = useState(false);

    const hideDialogRequired = () => setVisibleModalRequired(false);

    const initialValues = {
        name: "",
        correo: "",
        mensaje: ""
    };

    function handleSelectedCountry(country) {
        setSelectedCountry(country);
    }

    const validationSchema = yup.object().shape({
        name: yup.string()
            .trim()
            .required('Ingrese sus nombres')
            .matches(/^[a-zA-Z\s]+$/, 'El nombre solo debe contener letras y espacios'),
        correo: yup.string()
            .trim()
            .required('Ingrese su correo electrónico')
            .email('Ingrese un correo electrónico válido'),
        mensaje: yup.string()
            .trim()
            .required('Ingrese un mensaje')
            .matches(/^[a-zA-Z\s]+$/, 'El mensaje solo debe contener letras y espacios'),
    });

    const handleSubmit = async (values, { setSubmitting, setTouched }) => {
        // Verifica si el número de teléfono está vacío o inválido
        const phoneDigits = values.phoneNumber.replace(/\D/g, '');
    
        if (!phoneDigits || phoneDigits.length !== 10 || (selectedCountry?.cca2 === 'CO' && !phoneDigits.startsWith('3'))) {
            setVisibleModalRequired(true); // Mostrar el modal "required"
            return; // Detener el envío
        }
    
        try {
            console.log(values);
            await validationSchema.validate(values, { abortEarly: false });
            hideDialog(); // Cierra el diálogo si la validación fue exitosa
        } catch (validationErrors) {
            console.log(validationErrors.inner.map((error) => error.message));
            setVisibleModalRequired(true); // Mostrar el modal en caso de errores de validación
        }
    };

    const handleInputValue = (phoneNumber) => {
        setInputValue(
            selectedCountry?.cca2 != 'CO'
                ? phoneNumber
                : phoneNumber.startsWith('3')
                    ? phoneNumber
                    : '',
        );
    };

    return (
        <>
            <Portal>
                <Dialog
                    visible={visibleModal}
                    onDismiss={hideDialog}
                    style={styles.dialog}>
                    {
                        icon && (
                            <Dialog.Icon icon={icon} size={80} color={colorIcon} />
                        )
                    }
                    <IconButton
                        icon="close"
                        size={24}
                        onPress={hideDialog}
                        style={styles.closeButton}
                        iconColor="black"
                    />
                    <Dialog.Title style={styles.title}>{title}</Dialog.Title>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                        validationSchema={validationSchema}
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
                                <Dialog.Content style={styles.dialogContent}>
                                    <TextInput
                                        placeholderTextColor='#5A5A5A'
                                        placeholder="Nombre"
                                        style={[
                                            styles.input,
                                            errors.name && touched.name && styles.inputError // Aplica el estilo de error solo si hay error
                                        ]}
                                        textColor='black'
                                        value={values.name}
                                        onChangeText={(text) => {
                                            const filteredText = text.replace(/[^a-zA-ZñÑ\s]+/g, '');
                                            setFieldValue('name', filteredText);
                                        }}
                                        onBlur={handleBlur('name')}
                                        underlineColor="transparent" // Esto elimina el borde morado
                                        activeUnderlineColor="transparent"
                                    />
                                    {touched.name && errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                                    <TextInput
                                        placeholderTextColor='#5A5A5A'
                                        placeholder="Correo"
                                        style={[
                                            styles.input,
                                            errors.correo && touched.correo && styles.inputError // Aplica el estilo de error solo si hay error
                                        ]}
                                        textColor='black'
                                        onChangeText={(text) => {
                                            const filteredText = text.trim();
                                            handleChange('correo')(filteredText);
                                        }}
                                        onBlur={handleBlur('correo')}
                                        value={values.correo}
                                        underlineColor="transparent" // Esto elimina el borde morado
                                        activeUnderlineColor="transparent"
                                    />
                                    {touched.correo && errors.correo && <Text style={styles.errorText}>{errors.correo}</Text>}
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
                                            phoneInputStyles={{ flagContainer: { backgroundColor: 'white', height: 23, width: 70, marginLeft: 25 } }}
                                            defaultCountry="co"
                                            placeholder="Numero teléfono"
                                            modalStyles={{
                                                countryName: styles.countryText,
                                                searchInput: { color: 'black' },
                                            }}
                                            modalSearchInputPlaceholder="Busca el pais"
                                        />
                                    </View>
                                    <TextInput
                                        multiline
                                        placeholderTextColor='#5A5A5A'
                                        placeholder="Escriba su mensaje"
                                        style={[
                                            styles.input,
                                            errors.mensaje && touched.mensaje && styles.inputError // Aplica el estilo de error solo si hay error
                                        ]}
                                        textColor='black'
                                        onChangeText={(text) => {
                                            const filteredText = text.trim();
                                            handleChange('mensaje')(filteredText);
                                        }}
                                        onBlur={handleBlur('mensaje')}
                                        value={values.mensaje}
                                        underlineColor="transparent" // Esto elimina el borde morado
                                        activeUnderlineColor="transparent"
                                    />
                                    {touched.mensaje && errors.mensaje && <Text style={styles.errorText}>{errors.mensaje}</Text>}
                                </Dialog.Content>
                                <Dialog.Actions style={styles.dialogActions}>
                                    <Button style={styles.button} onPress={handleSubmit}
                                        labelStyle={styles.buttonText}>
                                        Enviar mensaje
                                    </Button>
                                </Dialog.Actions>
                            </>
                        )}
                    </Formik>
                </Dialog>

            </Portal>
            <ModalDialog
                visibleModal={visibleModalRequired}
                title="Ups!"
                description="Debes completar el numero de telefono"
                icon={iconModal.alert}
                hideDialog={hideDialogRequired}
                colorIcon='rgb(186, 26, 26)'
            />
        </>
    );
}

const styles = StyleSheet.create({
    dialog: {
        backgroundColor: 'white',
        alignItems: 'center',
        paddingHorizontal: 2,
    },
    title: {
        textAlign: 'center',
        color: '#414141',
        fontSize: 18
    },
    input: {
        borderWidth: 1,
        borderColor: '#B8B8B8',
        borderRadius: 8,
        color: 'black',
        marginBottom: 8, // Space between inputs
        backgroundColor: 'white',
    },
    inputError: {
        borderColor: 'red',
    },
    inputOutline: {
        borderColor: 'rgba(184, 184, 184, 1)',
        borderRadius: 8
    },
    phoneInputContainer: {
        marginBottom: 8,
    },
    countryText: {
        color: 'black'
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 2,
    },
    phoneInput: {
        width: '100%',
        borderRadius: 5,
        color: 'black',
        marginLeft: 12,
        fontSize: 16,
        marginTop: 2
    },
    dialogContent: {
        width: '100%',
        marginBottom: 20,
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
        top: -10,
        right: 5
    },
    dialogActions: {
        width: '100%', // Ensures the actions container takes up the full width of the modal
        alignItems: 'center'
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