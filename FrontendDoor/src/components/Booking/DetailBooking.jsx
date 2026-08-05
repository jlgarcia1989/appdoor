import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Icon, IconButton, MD3Colors, Portal } from 'react-native-paper';
import Modal from 'react-native-modal';
import moment from 'moment';
import 'moment/locale/es';
import { cancelBookingForId } from '../../services/Booking/booking';
import ConfirmCancelDialog from '../../pages/ConfirmDialog';
import { iconModal } from '../../utils/Icons';

const DetailBooking = ({ isVisible, onClose, detailBooking }) => {

  const [visibleConfirm, setVisibleConfirm] = useState(false);

  const formatDate = (date) => {
    const fecha = moment(date);
    fecha.locale('es');
    return fecha.format('dddd DD [de] MMMM [de] YYYY');
  }

  const formatHour = (date) => {
    const fecha = moment(date);
    return fecha.format('hh:mm a');
  }

  const cancelBooking = async () => {
    const response = await cancelBookingForId(detailBooking.idReserva);
    if (response?.idRutaReserva) {
      onClose(response)
    }
  }


  const hideDialog = () => {
    setVisibleConfirm(!visibleConfirm)
  }

  return (
    <>
      <Modal
        isVisible={isVisible}
        onBackdropPress={onClose}
        onSwipeComplete={onClose}
        swipeDirection="down"
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <IconButton
              icon="arrow-left"
              iconColor='white'
              color
              size={23}
              onPress={() => console.log('pressed')}
            />
            <View style={styles.handle} />
            <IconButton
              icon="close"
              iconColor={MD3Colors.neutral0}
              size={23}
              onPress={onClose}
            />
          </View>
          <View style={styles.header}>
            <Text style={styles.modalTitle}>Reserva #{detailBooking.idReserva}</Text>
            <Text style={detailBooking.descripcionEstado === 'Activo' ? styles.statusActive : detailBooking.idEstadoReserva === 2 ? styles.statusCancel : styles.statusPending}>{detailBooking.descripcionEstado === 'Extradordinaria' ? 'Pendiente' : detailBooking.descripcionEstado}</Text>
          </View>
          <View style={styles.userInfo}>
            <Image source={require('./../../../assets/profile-icon.png')} style={styles.avatar} />
            <View>
              <Text style={styles.userName}>{detailBooking.conductor ? detailBooking.conductor : 'No asignado'}</Text>
              <Text style={styles.userRating}>Sin calificacion</Text>
            </View>
            <Image source={require('./../../../assets/car.jpg')} style={styles.carImage} />
          </View>
          <View style={styles.bookingInfo}>
            <View style={styles.bookingRow}>
              <Icon source="calendar" size={22} color='rgba(79, 79, 79, 1)' />
              <Text style={styles.bookingText}>{formatDate(detailBooking.fechaHora)}</Text>
            </View>
            <View style={styles.bookingRow}>
              <Icon source="clock" size={22} color='rgba(79, 79, 79, 1)' />
              <Text style={styles.bookingText}>{formatHour(detailBooking.fechaHora)}</Text>
            </View>
            <View style={styles.bookingRow}>
              <Icon source="account" size={22} color='rgba(79, 79, 79, 1)' />
              <Text style={styles.bookingText}>{detailBooking.cantidadPasajeros} pasajeros</Text>
            </View>
          </View>
          <View style={styles.locationInfo}>
            <View style={styles.locationContainer}>
              <Icon source="map-marker" color={MD3Colors.error50} size={25} />
              <View>
                <Text style={styles.locationCity}>{detailBooking.descripcionRuta?.split('-')[0]}</Text>
                <Text style={styles.locationAddress}>{detailBooking?.direccionOrigen}</Text>
              </View>
            </View>
            <View style={styles.dottedLineContainer}>
              <View style={styles.dottedLine}></View>
            </View>
            <View style={styles.locationContainer}>
              <Icon source="map-marker" color='rgba(9, 44, 76, 1)' size={25} />
              <View>
                <Text style={styles.locationCity}>{detailBooking.descripcionRuta?.split('- ')[1]}</Text>
                <Text style={styles.locationAddress}>{detailBooking?.direccionDestino}</Text>
              </View>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.iconButton} onPress={() => { /* Lógica para llamada */ }}>
              <IconButton
                icon="phone"
                iconColor='rgba(9, 44, 76, 1)'
                size={20}
                onPress={() => console.log('Pressed')}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => { /* Lógica para chat */ }}>
              <IconButton
                icon="chat-processing"
                iconColor='rgba(9, 44, 76, 1)'
                size={20}
                onPress={() => console.log('Pressed')}
              />
            </TouchableOpacity>
            <TouchableOpacity style={[
              styles.cancelButton,
              detailBooking.idEstadoReserva === 2 && styles.cancelButtonDisabled
            ]} onPress={hideDialog} disabled={detailBooking.idEstadoReserva === 2}>
              <Text style={[
                styles.cancelButtonText,
                detailBooking.idEstadoReserva === 2 && styles.cancelButtonTextDisabled
              ]} >Cancelar Reservación</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={visibleConfirm}
        onBackdropPress={hideDialog}
        style={styles.modalConfirmContainer}
      >
        <ConfirmCancelDialog
          visibleModal={visibleConfirm}
          title="Cancelar reserva"
          description="¿Estas seguro de cancelar la reserva?"
          icon={iconModal.alert}
          hideDialog={hideDialog}
          colorIcon='rgb(186, 26, 26)'
          confirmAction={cancelBooking}
        />
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    margin: 0,
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: -10,
  },
  handle: {
    width: 134,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 18
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderBottomWidth: 1,
    paddingBottom: 10,
    borderBottomColor: 'rgba(221, 221, 221, 1)'
  },
  modalTitle: {
    fontSize: 18,
    color: 'rgba(90, 90, 90, 1)'
  },
  statusActive: {
    backgroundColor: 'lightgreen',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
    color: 'rgba(130, 130, 130, 1)',
    fontSize: 14
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
    color: 'rgba(130, 130, 130, 1)'
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginVertical: 16,
    borderBottomWidth: 1,
    paddingBottom: 10,
    borderBottomColor: 'rgba(221, 221, 221, 1)'
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black'
  },
  userRating: {
    color: 'gray',
  },
  carImage: {
    width: 60,
    height: 60,
    marginLeft: 'auto',
  },
  bookingInfo: {
    width: '100%',
    marginBottom: 16,
    borderBottomWidth: 1,
    paddingBottom: 10,
    borderBottomColor: 'rgba(221, 221, 221, 1)'
  },
  bookingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bookingText: {
    marginLeft: 8,
    fontSize: 14,
    color: 'black'
  },
  locationInfo: {
    width: '100%',
    marginBottom: 16,
    borderBottomWidth: 1,
    paddingBottom: 10,
    borderBottomColor: 'rgba(221, 221, 221, 1)'
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: -8,
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
    alignSelf: 'flex-start',
    marginLeft: 11
  },
  locationCity: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    color: 'rgba(90, 90, 90, 1)'
  },
  locationAddress: {
    marginLeft: 8,
    color: '#555',
  },
  distance: {
    marginLeft: 'auto',
    color: '#555',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  iconButton: {
    backgroundColor: 'white',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(9, 44, 76, 1)'
  },
  cancelButton: {
    backgroundColor: 'rgba(9, 44, 76, 1)',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  cancelButtonText: {
    color: 'rgba(255, 255, 255, 1)',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButtonDisabled: {
    backgroundColor: 'rgba(200, 200, 200, 1)', // Color gris para el botón deshabilitado
  },
  cancelButtonTextDisabled: {
    color: 'rgba(150, 150, 150, 1)', // Color gris más claro para el texto deshabilitado
  },
  modalConfirmContainer: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',

  },
});

export default DetailBooking;
