import { useNavigation } from '@react-navigation/native';
import React from 'react'
import { View, StyleSheet } from 'react-native';
import { Text, Button, IconButton } from 'react-native-paper';

export default function VerificationDocuments() {
       const navigation = useNavigation();
    return (
        <>
            <View style={styles.container}>
                <IconButton
                    icon="clock-outline"
                    size={103}
                    iconColor="#E2B93B"
                    style={styles.icon}
                />
                <Text style={styles.title}>¡Tu solicitud está en proceso!</Text>
                <Text style={styles.subtitle}>
                    Estamos revisando tus documentos para asegurarnos de que todo esté en orden. Este proceso puede tomar algo de tiempo.
                </Text>
                <Text style={styles.subtitle}>
                    Te notificaremos tan pronto como tu perfil esté listo para arrancar. ¡Gracias por unirte a nuestra comunidad de conductores!
                </Text>


            </View>
            <View style={styles.footer}>
                <Button
                    mode="contained"
                    onPress={() => navigation.navigate('HomeDriver')}
                    style={styles.button}
                    labelStyle={styles.buttonLabel}
                >
                    Regresar al Inicio
                </Button>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingBottom:'45%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    icon: {
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 16,
        color: '#1D1D1D',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#1D1D1D',
        marginBottom: 12,
        fontWeight: '400'
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
        fontWeight: 'bold'
    },
    footer: {
        width: '100%',
        paddingHorizontal: 20,
        position: 'absolute',
        bottom: 0,
        zIndex: 1,
        marginBottom: '3%'
    },
});