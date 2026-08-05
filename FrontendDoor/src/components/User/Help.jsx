import React, { useState } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, List, Surface } from 'react-native-paper';
import FormDialog from '../../pages/FormDialog';
import { useNavigation } from '@react-navigation/native';

export default function Help() {
  const navigation = useNavigation();
  const [visibleFormModal, setVisibleFormModal] = useState(false);

  const handleFormDialogClick = () => {
    setVisibleFormModal(true)
  }

  const hideFormDialog = () => {
    setVisibleFormModal(false);
  }

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Text variant="titleMedium" style={styles.title}>
          Ayuda y Soporte
        </Text>

        <Surface style={styles.item}>
          <List.Item
            title="FAQs"
            titleStyle={{ color: '#092C4C', fontSize: 14 }}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => { navigation.navigate('Faqs') }}
          />
        </Surface>

        <Surface style={styles.item}>
          <List.Item
            title="Contáctenos"
            titleStyle={{ color: '#092C4C', fontSize: 14 }}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleFormDialogClick}
          />
        </Surface>

        <Surface style={styles.item}>
          <List.Item
            title="Chatea con nosotros"
            titleStyle={{ color: '#092C4C', fontSize: 14 }}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => { }}
          />
        </Surface>
      </ScrollView>
      <FormDialog
        hideDialog={hideFormDialog}
        title='Contactenos'
        visibleModal={visibleFormModal}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    alignSelf: 'center',
    marginVertical: 16,
    fontWeight: '500',
    color: '#414141',
    fontSize: 18
  },
  item: {
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#FFFFFF',
    elevation: 0,
  },
});