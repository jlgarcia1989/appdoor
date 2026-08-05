import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, TextInput, List } from 'react-native-paper';

export default function FaqScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="titleMedium" style={styles.title}>
        FAQs
      </Text>

      <TextInput
        mode="outlined"
        placeholder="Buscar por pregunta"
        placeholderTextColor={'#092C4C'}
        left={<TextInput.Icon icon="magnify" color={'#092C4C'} size={20} />}
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchInput}
        textColor='#4F4F4F'
      />

      {/* Sección: Sobre el servicio */}
      <Text style={styles.sectionTitle}>Sobre el servicio</Text>
      <List.Accordion title="¿Qué es esta app y cómo funciona?" style={styles.sectionItem} titleStyle={styles.titleItem}>
        <List.Item title="Esta app permite..." titleStyle={styles.titleItem}/>
      </List.Accordion>
      <List.Accordion title="¿Qué empresas de transporte están disponibles en la app?" style={styles.sectionItem} titleStyle={styles.titleItem}>
        <List.Item title="Las empresas disponibles son..." titleStyle={styles.titleItem}/>
      </List.Accordion>
      <List.Accordion title="¿En qué ciudades y municipios está disponible el servicio?" style={styles.sectionItem} titleStyle={styles.titleItem}>
        <List.Item title="Está disponible en..." titleStyle={styles.titleItem}/>
      </List.Accordion>

      {/* Sección: Reservas y horarios */}
      <Text style={styles.sectionTitle}>Reservas y horarios</Text>
      <List.Accordion title="¿Cómo puedo reservar un tiquete?" style={styles.sectionItem} titleStyle={styles.titleItem}>
        <List.Item title="Puedes reservar desde la sección de compras..." titleStyle={styles.titleItem}/>
      </List.Accordion>
      <List.Accordion title="¿Puedo reservar para otra persona?" style={styles.sectionItem} titleStyle={styles.titleItem}>
        <List.Item title="Sí, puedes ingresar sus datos..." titleStyle={styles.titleItem}/>
      </List.Accordion>
      <List.Accordion title="¿Con cuánta anticipación puedo comprar un tiquete?" style={styles.sectionItem} titleStyle={styles.titleItem}>
        <List.Item title="Puedes hacerlo hasta..." titleStyle={styles.titleItem}/>
      </List.Accordion>

      {/* Sección: Pagos y facturación */}
      <Text style={styles.sectionTitle}>Pagos y facturación</Text>
      <List.Accordion title="¿Qué métodos de pago aceptan?" style={styles.sectionItem} titleStyle={styles.titleItem}>
        <List.Item title="Aceptamos tarjetas de crédito, débito..." titleStyle={styles.titleItem}/>
      </List.Accordion>
      <List.Accordion title="¿Es seguro pagar por la app?" style={styles.sectionItem} titleStyle={styles.titleItem}>
        <List.Item title="Sí, usamos cifrado y servicios de pago confiables..." titleStyle={styles.titleItem}/>
      </List.Accordion>
      <List.Accordion title="¿Puedo solicitar factura electrónica?" style={styles.sectionItem} titleStyle={styles.titleItem}>
        <List.Item title="Sí, al finalizar la compra..." titleStyle={styles.titleItem} />
      </List.Accordion>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor:'#FFFFFF'
  },
  title: {
    alignSelf: 'center',
    marginBottom: 16,
    fontWeight: '500',
    color:'#414141',
    fontSize:16
  },
  searchInput: {
    marginBottom: 24,
    backgroundColor:'#FFFFFF',
    borderRadius:8,
    fontSize:14,
    color:'#4F4F4F'
  },
  sectionTitle: {
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 4,
    fontSize: 18,
    color:'#414141',
  },
  sectionItem:{
    backgroundColor:'#FFFFFF'
  },
  titleItem:{
    color:'#4F4F4F',
    fontSize:14
  }
});
