import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Header from '../Home/Header';
import { Avatar, Icon } from 'react-native-paper';

export default function HomeDriver() {
    const [activeTab, setActiveTab] = useState('Disponible');
    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'Disponible' && styles.activeTab]}
                    onPress={() => setActiveTab('Disponible')}
                >
                    <Text style={[styles.tabText, activeTab === 'Disponible' && styles.activeTabText]}>Disponible</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'No Disponible' && styles.inactiveTab]}
                    onPress={() => setActiveTab('No Disponible')}
                >
                    <Text style={[styles.tabText, activeTab === 'No Disponible' && styles.activeTabText]}>No Disponible</Text>
                </TouchableOpacity>
            </View>

            {/* Dirección actual */}
            <View style={styles.locationRow}>
                <Icon source="map-marker" size={20} color="#333" />
                <Text style={styles.locationText}>Carrera 7 # 140-33, Usaquén, Bogotá</Text>
            </View>

            {/* Tarjeta de reserva */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Reserva #0001</Text>

                {/* Origen */}
                <View style={styles.routeRow}>
                    <Icon source="map-marker" size={20} color="red" />
                    <View>
                        <Text style={styles.city}>Bogotá</Text>
                        <Text style={styles.address}>Carrera 7 # 140-33, Usaquén, Bogotá</Text>
                    </View>
                </View>

                {/* Destino */}
                <View style={styles.routeRow}>
                    <Icon source="map-marker" size={20} color="#002F5F" />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.city}>Medellín</Text>
                        <Text style={styles.address}>Cra 70 # 44D - 105, El Poblado, Medellín, Antioqui</Text>
                    </View>
                    <Text style={styles.distance}>1.1km</Text>
                </View>

                {/* Avatares */}
                <View style={styles.avatarRow}>
                    <Avatar.Image size={40} source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }} />
                    <Avatar.Image size={40} source={{ uri: 'https://randomuser.me/api/portraits/women/2.jpg' }} style={{ marginLeft: 10 }} />
                    <Avatar.Image size={40} source={{ uri: 'https://randomuser.me/api/portraits/women/3.jpg' }} style={{ marginLeft: 10 }} />
                </View>

                {/* Botones */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.outlineButton}>
                        <Text style={styles.outlineButtonText}>Ver detalle</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filledButton}>
                        <Text style={styles.filledButtonText}>Aceptar Ruta</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    tabContainer: {
        flexDirection: 'row',
        marginHorizontal: 16,
        borderWidth: 1,
        borderColor: '#092C4C',
        borderRadius: 10,
        overflow: 'hidden',
        marginTop:30
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderColor: 'transparent',
    },
    activeTab: {
        borderColor: '#003366',
        backgroundColor: 'rgba(9, 44, 76, 1)',
        borderRadius: 8
    },
    inactiveTab: {
        borderColor: '#003366',
        backgroundColor: 'rgba(9, 44, 76, 1)',
        borderRadius: 8
    },
    cancelTab: {
        borderColor: '#003366',
        backgroundColor: '#EB5757',
        borderRadius: 8
    },
    tabText: {
        fontSize: 14,
        color: '#888',
    },
    activeTabText: {
        color: 'white',
        fontWeight: 'bold',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginTop:30
    },
    locationText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#333',
    },
    card: {
        marginHorizontal: 16,
        marginTop:30,
        padding: 16,
        borderWidth: 1,
        borderColor: '#003366',
        borderRadius: 10,
        backgroundColor: '#fff',
    },
    cardTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 12,
        color: '#1D1D1D',
    },
    routeRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    city: {
        fontWeight: 'bold',
        color: '#1D1D1D',
    },
    address: {
        fontSize: 12,
        color: '#888',
    },
    distance: {
        fontSize: 12,
        color: '#333',
        alignSelf: 'center',
    },
    avatarRow: {
        flexDirection: 'row',
        marginTop: 12,
        marginBottom: 16,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    outlineButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#002F5F',
        padding: 10,
        borderRadius: 8,
        marginRight: 8,
        alignItems: 'center',
    },
    outlineButtonText: {
        color: '#002F5F',
        fontWeight: '600',
    },
    filledButton: {
        flex: 1,
        backgroundColor: '#002F5F',
        padding: 10,
        borderRadius: 8,
        marginLeft: 8,
        alignItems: 'center',
    },
    filledButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
});