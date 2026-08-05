import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Divider } from 'react-native-paper';
import Header from '../Home/Header';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../hooks/AuthContext';
import { getListBookings } from '../../services/Booking/booking';
import Spinner from '../../pages/SpinnerActivity';
import { formatDate, formatHour } from '../../utils/Utils';

export default function Historical() {
  const [activeTab, setActiveTab] = useState('Reservado');

  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listBooking, setListBookings] = useState([])
  const [listCompleted, setListCompleted] = useState([])
  const [listCanceled, setListCanceled] = useState([])
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
      if (list?.length) {
        let reservedList = []
        let completedList = []
        let canceledList = []
        list.forEach(element => {
          if (element.descripcionEstado === 'Pendiente' || element.descripcionEstado === 'Activo') {
            reservedList.push(element)
          } else if (element.descripcionEstado === 'Completado') {
            completedList.push(element)
          } else if (element.descripcionEstado === 'Cancelada') {
            canceledList.push(element)
          }
        });
        setListBookings(reservedList)
        setListCompleted(completedList)
        setListCanceled(canceledList)
      }
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

  return (
    <>
      <View style={{ backgroundColor: 'white' }}>
        <Header paddingR={0} />
      </View>

      {
        loading ?

          <Spinner />
          :
          <ScrollView style={styles.container}>
            <Text style={styles.title}>Historial</Text>
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'Reservado' && styles.activeTab]}
                onPress={() => setActiveTab('Reservado')}
              >
                <Text style={[styles.tabText, activeTab === 'Reservado' && styles.activeTabText]}>Reservado</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'Completado' && styles.completeTab]}
                onPress={() => setActiveTab('Completado')}
              >
                <Text style={[styles.tabText, activeTab === 'Completado' && styles.activeTabText]}>Completado</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'Cancelado' && styles.cancelTab]}
                onPress={() => setActiveTab('Cancelado')}
              >
                <Text style={[styles.tabText, activeTab === 'Cancelado' && styles.activeTabText]}>Cancelado</Text>
              </TouchableOpacity>
            </View>

            <>
              {activeTab === 'Reservado' && (
                <>
                  {listBooking.map((book, index) => (
                    <Card style={styles.card} key={index}>
                      <Card.Content style={styles.cardContent}>
                        <View style={styles.cardHeader}>
                          <Text style={styles.cardTitle}>{book.descripcionRuta}</Text>
                          <Text style={styles.dateText}>{formatHour(book.fechaHora)}</Text>
                        </View>
                        <Text style={styles.dateText}>{formatDate(book.fechaHora)}</Text>
                        <Text style={styles.cardSubtitle}>{book.conductor ? book.conductor : 'Sin asignar'}</Text>
                      </Card.Content>
                    </Card>
                  ))}
                </>

              )}
              {activeTab === 'Completado' && (
                <>
                  {listCompleted.map((book, index) => (
                    <Card style={styles.card} key={index}>
                      <Card.Content style={styles.cardContent}>
                        <View style={styles.cardHeader}>
                          <Text style={styles.cardTitle}>{book.descripcionRuta}</Text>
                          <Paragraph style={styles.completedText}>{book.descripcionEstado}</Paragraph>
                        </View>
                        <Text style={styles.cardSubtitle}>{book.conductor ? book.conductor : 'Sin asignar'}</Text>
                      </Card.Content>
                    </Card>
                  ))}
                </>
              )}
              {activeTab === 'Cancelado' && (
                <>
                  {listCanceled.map((book, index) => (
                    <Card style={styles.card} key={index}>
                      <Card.Content style={styles.cardContent}>
                        <View style={styles.cardHeader}>
                          <Text style={styles.cardTitle}>{book.descripcionRuta}</Text>
                          <Paragraph style={styles.cancelledText}>{book.descripcionEstado}</Paragraph>
                        </View>
                        <Text style={styles.cardSubtitle}>{book.conductor ? book.conductor : 'Sin asignar'}</Text>
                      </Card.Content>
                    </Card>
                  ))}
                </>
              )}

            </>

          </ScrollView>
      }
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'rgba(42, 42, 42, 1)'
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#003366',
    backgroundColor: 'rgba(173, 216, 230, 0.3)'
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
  completeTab: {
    borderColor: '#003366',
    backgroundColor: '#27AE60',
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
  card: {
    marginBottom: 16,
    backgroundColor: 'white', // Fondo blanco
    borderRadius: 8, // Bordes redondeados
    borderWidth: 0.5,
    borderColor: 'rgba(9, 44, 76, 1)', // Borde gris claro
  },
  cardContent: {
    padding: 16
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  cardTitle: {
    fontSize: 16, // Tamaño de letra más pequeño
    fontWeight: 'bold',
    color: 'rgba(65, 65, 65, 1)', // Color de texto
  },
  dateText: {
    fontSize: 14,
    color: 'rgba(65, 65, 65, 1)',
    textAlignVertical: 'center'
  },
  cardSubtitle: {
    fontSize: 14,
    color: 'rgba(65, 65, 65, 1)', // Color de texto
  },
  completedText: {
    color: 'green',
    marginBottom: 8,
  },
  cancelledText: {
    color: 'red',
    marginBottom: 8,
  },
});

