import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import FastImage from 'react-native-fast-image';

const Spinner = () => (
    <View style={styles.container}>
        <FastImage
            style={styles.image}
            source={require('../../assets/logo-loading.gif')} // Asegúrate de que la ruta sea correcta
            resizeMode={FastImage.resizeMode.contain}
        />
    </View>
);

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(128, 128, 128, 0.5)',
        zIndex: 10
    },
    image: {
        width: 100,
        height: 100,
    },
});


export default Spinner;