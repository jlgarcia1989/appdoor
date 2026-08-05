import React from 'react';
import { View, StyleSheet, Linking, ImageBackground } from 'react-native';
import { Text, Button, IconButton } from 'react-native-paper';
import { SvgXml } from 'react-native-svg';
import { logo_horizontal, logo_horizontal_door } from '../../utils/Logo';

export default function About() {
  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <Text variant="titleMedium" style={styles.title}>
          Sobre Nosotros
        </Text>

        {/* Logo */}
        <SvgXml
          xml={logo_horizontal_door}
          style={styles.logo}
        />

        {/* Descripción */}
        <Text style={styles.description}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.{"\n"}
          Facilisis volutpat est velit egestas dui id. Sed libero enim sed faucibus turpis in eu mi bibendum.{"\n"}
          Cursus mattis molestie a iaculis at erat pellentesque adipiscing commodo.
        </Text>

        {/* Sección: Documentos */}
        <Text style={styles.subsectionTitle}>Documentos Oficiales</Text>

        <Button
          mode="outlined"
          icon="link-variant"
          style={styles.linkButton}
          textColor='#092C4C'
        >
          Sitio web oficial
        </Button>

        <Button
          mode="outlined"
          icon="file-document-outline"
          style={styles.linkButton}
          textColor='#092C4C'
        >
          Licencias
        </Button>

        {/* Versión */}
        <View style={styles.versionContainer}>
          <IconButton icon="link-variant" size={16} disabled />
          <Text style={styles.versionText}>version v1.1</Text>
        </View>
      </View>

      {/* Figura decorativa de fondo en esquina inferior izquierda */}
      <ImageBackground
        source={require('../../../assets/logo-loading.gif')} // asegúrate de tener esta imagen
        style={styles.backgroundFigure}
        imageStyle={{ resizeMode: 'contain', opacity: 0.05 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
  },
  container: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontWeight: '500',
    marginBottom: 24,
    color: '#414141',
  },
  logo: {
    width: 181,
    height: 39,
    marginBottom: 24,
  },
  description: {
    textAlign: 'center',
    color: '#555',
    marginBottom: 24,
    lineHeight: 20,
  },
  subsectionTitle: {
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    marginBottom: 12,
    fontSize: 16,
    color: '#000',
  },
  linkButton: {
    width: '100%',
    marginBottom: 12,
    borderRadius:8,
    alignItems:'flex-start'
  },
  versionContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 16,
    opacity: 0.5,
  },
  versionText: {
    fontSize: 12,
    color:'#414141'
  },
  backgroundFigure: {
    width: '100%',
    height: 200,
    position: 'absolute',
    bottom: -20,
    left: -120,
  },
});
