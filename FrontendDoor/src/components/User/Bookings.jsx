import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Icon, MD3Colors } from 'react-native-paper';
import Header from '../Home/Header';
import DetailBooking from '../Booking/DetailBooking';
import Spinner from '../../pages/SpinnerActivity';
import { getListBookings } from '../../services/Booking/booking';
import { useAuth } from '../../hooks/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

const Bookings = () => {

    const [isModalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [listBooking, setListBookings] = useState([])
    const [selectBooking, setSelectBooking] = useState(false);
    const { user } = useAuth();

    const getBookings = useCallback(async () => {
        setLoading(true);
        try {
            let body = {
                idUsuario: user?.idUsuario,
                idtipoUsuario: user?.idTipoUsuario,
                idRutaConductor: 0
            };
            const list = await getListBookings(body);
            const reservasOrdenadas = list.sort((a, b) => new Date(b.fechaHora) - new Date(a.fechaHora));
            setListBookings(reservasOrdenadas);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useFocusEffect(
        useCallback(() => {
            getBookings();
        }, [getBookings])
    );


    const handleOpenModal = (booking) => {
        setSelectBooking(booking);
        setModalVisible(true);
    };

    const handleCloseModal = async (booking) => {
        if(booking?.idRutaReserva){
            await getBookings()
        }
        setModalVisible(false);
    };


    return (
        <>
            <View style={{ backgroundColor: 'white' }}>
                <Header paddingR={0} />
            </View>
            {
                loading ?
                    <Spinner /> :
                    <ScrollView style={styles.container}>
                        <Text style={styles.title}>Lista de reservas</Text>
                        <Text style={styles.subtitle}>{listBooking.length} resultados encontrados</Text>
                        {
                            listBooking.map((booking, index) => (
                                <View style={styles.card} key={index}>
                                    <View style={styles.cardHeader}>
                                        <Text style={styles.cardTitle}>Reserva #{booking.idReserva}
                                        </Text>
                                        <Text style={booking.descripcionEstado  === 'Activo' ? styles.statusActive : booking.idEstadoReserva === 2 ? styles.statusCancel : styles.statusPending}>{booking.descripcionEstado === 'Extradordinaria'? 'Pendiente' : booking.descripcionEstado }</Text>
                                    </View>
                                    <Text style={styles.textType}>
{/*                                         <Text style={{ fontWeight: '700' }}>Tipo: </Text> */}
                                        <Icon
                                            source={booking?.encomiendas?.length ? "bag-personal-outline" :"account-supervisor-outline"}
                                            color='#828282'
                                            size={20}
                                        />
                                        {booking.encomiendas?.length ? `${booking?.encomiendas?.length} Encomienda${booking?.encomiendas?.length > 1 ? 's' : '' }` : `${booking?.cantidadPasajeros} Pasajero${booking?.cantidadPasajeros > 1 ? 's' : '' }`}
                                    </Text>
                                    <View style={styles.locationContainer}>
                                        <Icon
                                            source="map-marker"
                                            color={MD3Colors.error50}
                                            size={20}
                                        />
                                        <View>
                                            <Text style={styles.locationCity}>{booking.descripcionRuta?.split('-')[0]}</Text>
                                            <Text style={styles.locationAddress}>{booking?.direccionOrigen}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.dottedLineContainer}>
                                        <View style={styles.dottedLine}></View>
                                    </View>
                                    <View style={styles.locationContainer}>
                                        <Icon
                                            source="map-marker"
                                            color='#092C4C'
                                            size={20}
                                        />
                                        <View>
                                            <Text style={styles.locationCity}>{booking.descripcionRuta?.split('- ')[1]}</Text>
                                            <Text style={styles.locationAddress}>{booking?.direccionDestino}</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity style={styles.detailButton} onPress={()=>handleOpenModal(booking)}>
                                        <Text style={styles.detailButtonText}>Ver detalle</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        )
                    }
                    <DetailBooking isVisible={isModalVisible} onClose={handleCloseModal} detailBooking={selectBooking}/>
                    </ScrollView>
            }
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'white',
        marginBottom: 5
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        color: 'rgba(42, 42, 42, 1)'
    },
    subtitle: {
        fontSize: 14,
        color: '#555',
        marginBottom: 16,
    },
    card: {
        borderWidth: 1,
        borderColor: 'rgba(9, 44, 76, 1)',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'rgba(90, 90, 90, 1)',
    },
    textType: {
        fontSize: 14,
        fontWeight: '400',
        color: '#5A5A5A',
        marginBottom: 8,
    },
    statusActive: {
        backgroundColor: '#27AE6066',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 20,
        color: '#828282'
    },
    statusPending: {
        backgroundColor: '#E2B93B66',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 20,
        color: '#828282'
    },
    statusCancel: {
        backgroundColor: '#ffcccc',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 20,
        color: '#828282'
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom:-8
    },
    locationCity: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
        color: 'rgba(90, 90, 90, 1)'
    },
    locationAddress: {
        fontSize: 14,
        color: '#555',
        marginLeft: 8,
    },
    dottedLineContainer: {
        alignItems: 'center',
    },
    dottedLine: {
        width: 1,
        height: 30, // Ajusta esta altura según necesites
        borderStyle: 'dotted',
        borderWidth: 1,
        borderColor: 'gray',
        alignSelf:'flex-start',
        marginLeft:8
    },
    distance: {
        marginLeft: 'auto',
        fontSize: 14,
        color: '#555',
    },
    detailButton: {
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 20,
    },
    detailButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'rgba(9, 44, 76, 1)',
    },
});

export default Bookings;
