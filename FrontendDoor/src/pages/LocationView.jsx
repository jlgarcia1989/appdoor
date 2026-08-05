import { View, Text, StyleSheet, Platform, PermissionsAndroid, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import MapView, { Marker, Polyline } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { getCityForLocation } from '../services/Location/location';


export default function LocationView({ onCityChange }) {
    const [location, setLocation] = useState(null);
    const mapRef = useRef(null);

    const BogotaRegion = {
        latitude: 4.7110, // Coordenadas de Bogotá, Colombia
        longitude: -74.0721,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    };

    useEffect(() => {
        const getCurrentLocation = async () => {
            await Geolocation.getCurrentPosition(
                position => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    });
                    fetchCity(position.coords.latitude, position.coords.longitude);
                },
                error => {
                    console.warn(error.message);
                    Alert.alert('Error obteniendo la ubicación', error.message, [
                        {
                            text: 'OK',
                            onPress: () => setLocation({
                                latitude: 4.7110, // Coordenadas de Bogotá, Colombia
                                longitude: -74.0721,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            })
                        }
                    ]);
                }
            );
        };

        const requestLocationPermission = async () => {
            if (Platform.OS === 'ios') {
                Geolocation.requestAuthorization();
                getCurrentLocation();
            } else {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        {
                            title: 'Permiso de ubicación',
                            message: 'Necesitamos acceder a tu ubicación para mostrar el mapa.',
                            buttonNeutral: 'Preguntar luego',
                            buttonNegative: 'Cancelar',
                            buttonPositive: 'OK',
                        },
                    );
                    console.log(granted)
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        getCurrentLocation();
                    } else {
                        Alert.alert(
                            'Permiso de ubicación no concedido',
                            'Necesitas habilitar el permiso de ubicación para usar esta aplicación.',
                            [
                                {
                                    text: 'Cancelar',
                                    onPress: () => console.log('Cancel Pressed'),
                                    style: 'cancel'
                                },
                                {
                                    text: 'OK',
                                    onPress: () => requestLocationPermission()
                                }
                            ],
                            { cancelable: false }
                        );
                    }
                } catch (err) {
                    console.warn(err);
                }
            }
        };

        requestLocationPermission();
    }, []);

    const fetchCity = async (lat, lng) => {
        try {
            const response = await getCityForLocation(lat,lng)
            if(response){
                onCityChange(response);
            }
        } catch (error) {
            console.warn('Error fetching city:', error);
        }
    };

/*     useEffect(() => {
        if (location && mapRef.current) {
            const coordinates = [location, BogotaRegion];
            mapRef.current.fitToCoordinates(coordinates, {
                edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
                animated: true,
            });
        }
    }, [location]); */

    const polylineCoordinates = location ? [location, BogotaRegion] : [];

    return (
        <View style={styles.container}>
            {location ? (
                <MapView
                    style={styles.map}
                    region={location}
                    showsUserLocation={true}
                    initialRegion={location}
                    showsMyLocationButton={true}
                    followsUserLocation={true}
                    showsCompass={true}
                    scrollEnabled={true}
                    zoomEnabled={true}
                    pitchEnabled={true}
                    rotateEnabled={true}
                >
                <Marker coordinate={location} title="Mi Ubicación" />
{/*                 <Marker coordinate={BogotaRegion} title="Bogotá, Colombia" />
                <Polyline
                    coordinates={polylineCoordinates}
                    strokeWidth={2}
                    strokeColor="red"
                /> */}
                </MapView>
            ) : (
                <View>
                    <Text>Cargando...</Text>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    map: {
        ...StyleSheet.absoluteFillObject
    }
});