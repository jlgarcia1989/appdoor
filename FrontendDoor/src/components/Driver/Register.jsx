import React, { useCallback, useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Button, Chip, IconButton, MD3Colors, Modal, Portal, TextInput, Provider as PaperProvider, DefaultTheme, shadow, Text, Dialog, List, Checkbox } from 'react-native-paper'; // Importa componentes de React Native Paper
import { useAuth } from '../../hooks/AuthContext';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { termsAndConditions } from '../../utils/TermsAndConditions';
import ModalTerms from '../../pages/ModalTerms';
import ModalDialog from '../../pages/Dialog';
import { iconModal } from '../../utils/Icons';

export const Register = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [avatarSource, setAvatarSource] = useState(null);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const { user, login, updateUser, closeDrawer, openDrawer } = useAuth();
    const [visibleModalTerms, setVisibleModalTerms] = useState(false);
     const [visibleModal, setVisibleModal] = useState(false);
    const [checkedDocs, setCheckedDocs] = useState({
        driver: false,
        vehicle: false,
        policies: false
    });

    useEffect(() => {
        if (user && user?.urlImagen) {
            setAvatarSource(user.urlImagen.replace(/\\/g, '/'))
        }
    }, [user]);

    
    const hideDialog = () => {
        navigation.navigate('VerificationDocuments')
        setVisibleModal(!visibleModal)
    }

    useEffect(() => {
        const allChecked = checkedDocs.driver && checkedDocs.vehicle && checkedDocs.policies;
        setIsButtonDisabled(!allChecked);
      }, [checkedDocs]);

    const hideDialogTerms = () => {
        setVisibleModalTerms(false);
    }

    const handleTermsClick = () => {
        setVisibleModalTerms(true)
    }

    useFocusEffect(
        useCallback(() => {
            if (route.params?.savedDriverDocs) {
                setCheckedDocs(prevState => ({ ...prevState, driver: true }));
            }
            if (route.params?.savedVehicleDocs) {
                setCheckedDocs(prevState => ({ ...prevState, vehicle: true }));
            }
        }, [route.params])
    );


    return (

        <View style={styles.container}>
            <>
                <ScrollView>
                    <View style={styles.avatarContainer}>
                        <Avatar.Image
                            size={118}
                            style={styles.avatarImage}
                            source={{ uri: avatarSource }}
                        />
                        <Text style={styles.userName}>{user?.nombre + ' ' + user?.primerApellido}</Text>
                        <Text style={styles.userPhone}>{user?.numeroCelular}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.requirementsContainer}>
                        <Text style={styles.sectionTitle}>Requisitos necesarios</Text>

                        <List.Item
                            title="Documentos del conductor"
                            titleStyle={styles.listItemText}
                            left={() => (
                                <List.Icon icon="check" color={checkedDocs.driver ? "#43A048" : "#BDBDBD"} />
                            )}
                            disabled = {checkedDocs.driver}
                            onPress={() => navigation.navigate("DriverDocuments")}
                            right={() => <List.Icon icon="chevron-right" color='#323232' />}
                        />
                        <List.Item
                            title="Documentos del vehículo"
                            titleStyle={styles.listItemText}
                            left={() => (
                                <List.Icon icon="check" color={checkedDocs.vehicle ? "#43A048" : "#BDBDBD"} />
                            )}
                            disabled = {checkedDocs.vehicle}
                            onPress={() => navigation.navigate("VehicleDocuments")}
                            right={() => <List.Icon icon="chevron-right" color='#323232' />}
                        />

                        <View style={styles.policyContainer}>
                            <Checkbox
                                status={checkedDocs.policies ? "checked" : "unchecked"}
                                color="green"
                                onPress={() => setCheckedDocs({ ...checkedDocs, policies: !checkedDocs.policies })}
                            />
                            <Text style={styles.policyText}>
                                Como conductor, aceptas cumplir con nuestras{" "}
                                <Text style={styles.policyLink} onPress={() => handleTermsClick()}>Políticas de Servicio</Text> y estar sujeto a revisiones periódicas de seguridad.
                            </Text>
                        </View>
                    </View>
                </ScrollView>

                <ModalDialog
                    colorIcon='#C8E6C9'
                    description='Su solicitud ha sido enviada para revisión, se le notificara lo mas pronto posible.'
                    hideDialog={hideDialog}
                    icon={iconModal.check}
                    title='Solicitud Enviada'
                    visibleModal={visibleModal}

                />
                <View style={styles.footer}>
                    <Button
                        mode="contained"
                        onPress={() => setVisibleModal(true)}
                        style={[styles.button, isButtonDisabled && styles.disabledButton]}
                        labelStyle={styles.buttonLabel}
                        disabled= {isButtonDisabled}
                    >
                        Enviar Solicitud
                    </Button>
                </View>
                <ModalTerms
                    visibleModal={visibleModalTerms}
                    title="Política de privacidad"
                    description={termsAndConditions}
                    hideDialog={hideDialogTerms}
                />
            </>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: 'white',
        paddingBottom: 50
    },
    avatarImage: {
        backgroundColor: 'rgba(208, 208, 208, 1)'
    },
    userName: {
        fontSize: 18,
        fontWeight: "700",
        color: '#333333',
        marginTop: 20,
    },
    userPhone: {
        fontWeight: "400",
        fontSize: 16,
        color: "#333333",
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: 'center'
    },
    dateButton: {
        marginBottom: 10,
    },
    avatarContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        position: 'relative',
        marginTop: 15
    },
    divider: {
        height: 1,
        backgroundColor: "#ccc",
        marginVertical: 20,
        marginHorizontal: 20,
    },
    requirementsContainer: {
        paddingHorizontal: 20,
        marginTop: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 20,
        color: '#333333'
    },
    listItemText: {
        color: "#333333",
        fontSize: 16,
        fontWeight: "400",
    },
    policyContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
        marginLeft: -5,
        marginRight: 10
    },
    policyText: {
        flex: 1,
        fontSize: 14,
        color: "gray",
        textAlign: 'auto'
    },
    policyLink: {
        color: "#E2B93B"
    },
    inputOutline: {
        borderColor: 'rgba(184, 184, 184, 1)',
        borderRadius: 8
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
    },
    inputError: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 2,
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
});
