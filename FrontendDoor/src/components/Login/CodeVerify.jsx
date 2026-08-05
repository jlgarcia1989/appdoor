import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../hooks/AuthContext';
import { generateCodeAndNotification } from '../../services/Notifications/sendNotification';
import { OneSignal } from 'react-native-onesignal';
import ModalDialog from '../../pages/Dialog';
import { iconModal } from '../../utils/Icons';
import { userExist } from '../../services/User/User';
import Spinner from '../../pages/SpinnerActivity';


const CodeVerify = () => {
    // Referencias para las cajas de texto
    const codeInputs = Array(5).fill(0).map((_, index) => useRef(null));
    const [filledInputs, setFilledInputs] = useState(Array(5).fill(false));
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [codeGenerated, setCodeGenerated] = useState(Array(5).fill(''));
    const [currentCode, setCurrentCode] = useState(null);
    const [visibleModal, setVisibleModal] = useState(false);
    const navigation = useNavigation();
    const route = useRoute();
    const { code } = route.params;
    const { user, login, updateUser } = useAuth();
    const [loadingSpinner, setLoadingSpinner] = useState(false);

    const hideDialog = () => setVisibleModal(false);

    useEffect(() => {
        OneSignal.Notifications.addEventListener('click', async event => {
            const codeGenerate = event.notification.body.split(': ')[1]
            const generatedCodeArray = codeGenerate?.toString().split('');
            setCodeGenerated(generatedCodeArray);
            setFilledInputs(Array(5).fill(true));
            setIsButtonDisabled(false);
            setCurrentCode(codeGenerate);

        });
        const allFilled = filledInputs.every((filled) => filled);
        setIsButtonDisabled(!allFilled);
    }, [filledInputs]);

    useEffect(() => {
        if (code) {
            setCurrentCode(code)
        }
    }, []);

    // Función para enfocar la siguiente caja de texto
    const focusInput = (index, previous) => {
        if (previous && index > 0) {
            codeInputs[index - 1].current.focus();
        } else if (!previous && index < 4) {
            codeInputs[index + 1].current.focus();
        }
    };

    const replyVerify = async () => {
        const notification = await generateCodeAndNotification(user?.phoneNumber);
        if (notification?.code) {
            setCurrentCode(notification.code)
        }
    };


    // Función para cambiar el color de fondo de la caja de texto
    const inputStyle = (index) => {
        return {
            ...styles.codeInput,
            backgroundColor: filledInputs[index] ? 'rgba(178, 218, 239, 1)' : 'white',
        };
    };

    const validateCode = async () => {
        const codeInput = codeGenerated.join('')
        if (codeInput === currentCode) {
            setLoadingSpinner(true)
            const existUser = await userExist(user?.phoneNumber)
            if (existUser) {
               login()
               updateUser({
                    ...user,
                    ...existUser
                })
                setTimeout(() => {
                    navigation.navigate('Home');
                    setLoadingSpinner(false)
                }, 3000);
            } else{
                navigation.navigate('Profile', { isEdit: false });
                setLoadingSpinner(false)
            }
        } else {
            setVisibleModal(true)
        }
    }


    return (
        <View style={styles.container}>
            <>
                <Text style={styles.title}>Verificación de teléfono</Text>
                <Text style={styles.description}>Ingrese el código</Text>
                <View style={styles.codeContainer}>
                    {codeInputs.map((ref, index) => (
                        <TextInput
                            key={index}
                            ref={ref}
                            style={inputStyle(index)}
                            value={codeGenerated[index]}
                            keyboardType="numeric"
                            maxLength={1}
                            autoFocus={index === 0}
                            onChangeText={(text) => {
                                if (text.length > 0) {
                                    setFilledInputs((prev) => {
                                        const newFilledInputs = [...prev];
                                        newFilledInputs[index] = true;
                                        return newFilledInputs;
                                    });
                                    focusInput(index, false);
                                } else {
                                    setFilledInputs((prev) => {
                                        const newFilledInputs = [...prev];
                                        newFilledInputs[index] = false;
                                        return newFilledInputs;
                                    });
                                    focusInput(index, true);
                                }
                                setCodeGenerated((prev) => {
                                    const newCodeGenerated = [...prev];
                                    newCodeGenerated[index] = text;
                                    return newCodeGenerated;
                                });
                            }}
                        />
                    ))}
                </View>
                <Text style={styles.textRecorder}>No ha recibido el código?
                    <Text style={styles.link} onPress={replyVerify}> Volver a enviar</Text>
                </Text>
                <ModalDialog
                    visibleModal={visibleModal}
                    title="Ups!"
                    description="El codigo de verificación no es correcto, vuelve a intentarlo!"
                    icon={iconModal.alert}
                    hideDialog={hideDialog}
                    colorIcon='rgb(186, 26, 26)'
                />
                <View style={styles.footer}>
                    <Button
                        mode="contained"
                        onPress={validateCode}
                        style={[styles.button, isButtonDisabled && styles.disabledButton]}
                        labelStyle={styles.buttonLabel}
                    >
                        Verificar
                    </Button>
                </View>
            </>
            {loadingSpinner && (
                <Spinner />
            )}
        </View>
    );
};

export default CodeVerify;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: 'center',
        paddingVertical: 30,
        backgroundColor: 'white',
        alignItems: 'center'
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
        color: 'black'
    },
    description: {
        fontSize: 18,
        color: '#888',
        marginBottom: 20,
    },
    codeContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    codeInput: {
        width: 50,
        height: 48,
        borderWidth: 1,
        borderRadius: 5,
        textAlign: 'center',
        fontSize: 24,
        marginHorizontal: 5,
        borderColor: 'rgba(208, 208, 208, 1)',
        color: 'black',
        fontWeight: 'bold'
    },
    textRecorder: {
        fontSize: 16,
        color: '#888',
        margin: 20,
    },
    link: {
        textDecorationLine: 'none',
        color: 'rgba(254, 196, 0, 1)',
    },
    footer: {
        width: '100%',
        paddingHorizontal: 20,
        position: 'absolute',
        bottom: 0,
        zIndex: 1,
        marginBottom: '3%',
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
        fontWeight: 'bold',
    }
});
