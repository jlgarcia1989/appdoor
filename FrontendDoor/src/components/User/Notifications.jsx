import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { IconButton } from 'react-native-paper';

const initialNotificationsData  = [
  {
    id: '1',
    date: 'Hoy',
    title: 'Su viaje ha finalizado!',
    description: 'Lorem ipsum dolor sit amet consectetur. Ultrici es tincidunt eleifend vitae',
  },
  {
    id: '2',
    date: 'Ayer',
    title: 'Se ha asignado un conductor!',
    description: 'Lorem ipsum dolor sit amet consectetur. Ultrici es tincidunt eleifend vitae',
  },
  {
    id: '3',
    date: 'May, 27 2023',
    title: 'Califique su experiencia!',
    description: 'Lorem ipsum dolor sit amet consectetur. Ultrici es tincidunt eleifend vitae',
  }
];

export default function Notifications() {
  const [notificationsData, setNotificationsData] = useState(initialNotificationsData);
  const renderItem = ({ item }) => {
    const rightSwipe = () => (
      <View style={styles.deleteContainer}>
        <IconButton
          icon="delete" 
          color="white" 
          size={24} 
          iconColor='white'
          onPress={() => handleDelete(item.id)} 
        />
      </View>
    );

    const handleDelete = (id) => {
      // Filtramos las notificaciones y eliminamos la que tenga el id correspondiente
      const updatedNotifications = notificationsData.filter(notification => notification.id !== id);
      setNotificationsData(updatedNotifications); // Actualizamos el estado con las notificaciones filtradas
    };

    return (
      <Swipeable renderRightActions={rightSwipe} >
        <View style={styles.notificationContainer}>
          <View style={styles.iconContainer}>
            <IconButton icon="information" color="white" size={24} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        </View>
      </Swipeable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notificaciones</Text>
      {notificationsData.map((group, index) => (
        <View key={index}>
          <Text style={styles.date}>{group.date}</Text>
          <FlatList
            data={notificationsData.filter(notification => notification.date === group.date)}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color:'#414141',
    marginTop:8
  },
  date: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#888',
    marginTop: 16,
  },
  notificationContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    backgroundColor: '#092C4C',
    borderRadius: 100,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: '#121212',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  deleteContainer: {
    backgroundColor: '#FF3B30', // Rojo para el botón de eliminar
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderRadius: 12,
    width: 20, // Establecer el ancho del área de swipe
    marginVertical: 8
  },
});
