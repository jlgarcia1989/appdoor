import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { IconButton, MD3Colors, Menu, TextInput } from 'react-native-paper';
import Modal from 'react-native-modal';
import DropDownPicker from 'react-native-dropdown-picker';
import { useAuth } from '../../hooks/AuthContext';
import ModalDialog from '../../pages/Dialog';
import { iconModal } from '../../utils/Icons';
export default function Address() {
  const { user, updateUser } = useAuth();
  const [visibleModal, setVisibleModal] = useState(false);
  const [addresses, setAddresses] = useState([
    { id: '1', city: 'Medellín', address: 'Cra 70 # 44D - 105, El Poblado, Medellín', isDefault: false },
    { id: '2', city: 'Bogotá', address: 'Carrera 7 # 140-33, Usaquén, Bogotá', isDefault: false },
    { id: '3', city: 'Cali', address: 'Avenida 2 Norte # 5-72, Cali, Valle del Cauca', isDefault: false },
    { id: '4', city: 'Tolima', address: '2972 Westheimer Rd. Santa Ana, Illinois 85486', isDefault: false },
  ]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [address, setAddress] = useState('');
  const [editingItem, setEditingItem] = useState(null); 

  useEffect(() => {
   if(user){
    const copyAddresses = addresses.map((addr) => ({
      ...addr,
      isDefault: addr.city === user?.city?.county,
    }));
    console.log(user)
    setAddresses(copyAddresses)
   }
  },  []);


  const addAddress = () => {
    const newAdd = {city:value,address}
    setAddresses([...addresses, { id: Date.now().toString(), ...newAdd }]);
    setValue(null);
    setAddress('')
    setModalVisible(false);
  };
  const editAddress = (item) => {
    setEditingItem(item);  // Guardamos el ítem que estamos editando
    setValue(item.city);  // Establecemos la ciudad seleccionada
    setAddress(item.address);  // Establecemos la dirección a editar
    setModalVisible(true);  // Mostramos el modal
  };

  const handleDialogClick = () => {
    setVisibleModal(!visibleModal)
  }

  const saveEditedAddress = () => {
    const updatedAddresses = addresses.map((addr) =>
      addr.id === editingItem.id ? { ...addr, city: value, address } : addr
    );
    setAddresses(updatedAddresses);
    setModalVisible(false);
    setEditingItem(null); // Limpiar el estado de edición
  };

  const setDefaultAddress = (id) => {
    const updatedAddresses = addresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === id,
    }));
    updateUser({ ...user,city:addresses.find((addr)=>addr.id===id).city })
    handleDialogClick()
    setAddresses(updatedAddresses);
  };


  const cityPickerItems = [
    { label: 'Medellín', value: 'Medellín' },
    { label: 'Bogotá', value: 'Bogotá' },
    { label: 'Cali', value: 'Cali' },
    { label: 'Tolima', value: 'Tolima' }
  ];


  const renderAddressItem = ({ item }) => (
    <View style={styles.addressItem}>
      <IconButton icon={item.isDefault ? "map-marker-star" : "map-marker-outline"}  iconColor={item.isDefault ? '#092C4C' : '#B8B8B8'} size={20}  onPress={() => setDefaultAddress(item.id) } />
      <View style={styles.textView}>
        <Text style={styles.city}>{item.city}</Text>
        <Text style={styles.address} numberOfLines={4} ellipsizeMode="tail">
          {item.address}
        </Text>
      </View>
      <IconButton icon="pencil-box-outline" iconColor='#ADD8E6' size={20} onPress={() => editAddress(item) } />
    </View>
  );


  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Direcciones</Text>

        <FlatList
          data={addresses}
          keyExtractor={(item) => item.id}
          renderItem={renderAddressItem}
          contentContainerStyle={styles.listContainer}
        />

        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>Agregar nueva dirección</Text>
        </TouchableOpacity>

        <Modal
          isVisible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          style={styles.modalContainer}
          onBackdropPress={() => setModalVisible(false)}
          onSwipeComplete={() => setModalVisible(false)}
          swipeDirection='down'
        >
          <View style={styles.modalContent}>
            {/* Línea en la parte superior */}
            <View style={styles.modalHeader}>
              <IconButton
                icon="arrow-left"
                iconColor="transparent"
                color
                size={23}
                onPress={() => setModalVisible(true)}
              />
              <View style={styles.handle} />
              <IconButton
                icon="close"
                iconColor={MD3Colors.neutral0}
                size={23}
                onPress={() => {
                  setModalVisible(false)
                  setEditingItem(null); // Limpiar el ítem de edición al cerrar
                }}
              />
            </View>

            {/* Título del modal */}
            <Text style={styles.modalTitle}>{editingItem ? 'Editar dirección' : 'Agregar dirección'}</Text>

            {/* Select de ciudades con DropDownPicker */}
            <View style={styles.selectContainer}>
              <DropDownPicker
                open={open}
                setOpen={setOpen}
                value={value}
                setValue={setValue}
                items={cityPickerItems}
                containerStyle={styles.pickerContainer}
                style={styles.picker}
                dropDownStyle={styles.dropdown}
                placeholder="Seleccionar la ciudad"
              />
            </View>

            {/* TextInput con ícono a la izquierda */}
            <View style={styles.textInputIcon}>
            <TextInput
              placeholder="Ingrese la dirección completa"
              mode="outlined"
              textColor='black'
              activeOutlineColor='rgba(100, 100, 100, 1)'
              style={styles.input}
              placeholderTextColor="#999"
              value={address}
              outlineStyle={styles.inputOutline}
              onChangeText={(text) => {
                setAddress(text)
              }}
            />
            </View>

            {/* Botón Agregar */}
            <TouchableOpacity style={styles.addButton} onPress={editingItem ? saveEditedAddress : addAddress}>
            <Text style={styles.addButtonText}>{editingItem ? 'Guardar cambios' : 'Agregar'}</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <ModalDialog
          colorIcon='green'
          description='Has agregado la direccion como predeterminada!'
          hideDialog={(acept)=>handleDialogClick(acept)}
          icon={iconModal.check}
          title='Felicitaciones'
          visibleModal={visibleModal}

        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2A2A2A'
  },
  listContainer: {
    paddingBottom: 16,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginBottom: 8,
    borderRadius: 8,
  },
  textView: {
    flex: 1,
    marginRight: 10
  },
  city: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#414141'
  },
  textInputIcon:{
    padding:12
  },
  address: {
    fontSize: 14,
    color: '#B8B8B8',
    flexShrink: 1,
    marginRight: 10
  },
  addButton: {
    backgroundColor: '#092C4C',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    marginHorizontal: 10,
    marginVertical: 10
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    margin: 0,
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  handle: {
    width: 100,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 10,
  },
  separator: {
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    width: 60,
    alignSelf: 'center',
    marginVertical: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  selectContainer: {
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    zIndex: 100,
  },
  pickerContainer: {
    height: 50,
    zIndex: 9999,
  },
  picker: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderColor: '#B8B8B8',
    height:55
  },
  dropdown: {
    backgroundColor: 'white',
    borderRadius: 8
  },
  selectText: {
    color: '#000',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
    color: 'black'
  },
  input: {
    marginBottom: 5,
    backgroundColor: '#fff',
    borderColor: '#B8B8B8',
    fontSize: 14,
    paddingLeft: 25,
    textShadowColor: 'black'
  },
  inputOutline: {
    borderColor: 'rgba(184, 184, 184, 1)',
    borderRadius: 8
  },
  modalAddButton: {
    backgroundColor: '#002f6c',
    paddingVertical: 12,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  modalAddButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});