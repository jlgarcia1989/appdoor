import React, { useEffect, useRef, useState } from 'react';
import { SvgXml } from 'react-native-svg';
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  useWindowDimensions
} from 'react-native';
import { Logoxml } from '../utils/Logo';
import { Button } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { useAuth } from '../hooks/AuthContext';
import { useNavigation } from '@react-navigation/native';


function Welcome() {
  const { width, height } = useWindowDimensions(); 
  const [animationCompleted, setAnimationCompleted] = useState(false);
  const { isAuthenticated, login } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      setAnimationCompleted(true);
    }, 2000);
    if (isAuthenticated) {
        navigation.navigate('Home');
      }
  },  [isAuthenticated, navigation]);

  const handleLogin = () => {
    //login();
    navigation.navigate('Login');
  };

  return (
    <ImageBackground
      source={require('../../assets/background.jpg')}
      style={styles.background}>
      <View style={styles.container}>
        <Animatable.View
          animation={animationCompleted ? 'fadeInUp' : undefined}
          duration={2000}
          style={styles.header}>
          <SvgXml
            xml={Logoxml}
            style={[
              {width: width * 0.25, height: height * 0.25},
              animationCompleted ? {transform: [{translateY: -250}]} : null,
            ]}
            fill="white"
          />
        </Animatable.View>
        <Animatable.View
          animation={animationCompleted ? 'fadeInUp' : undefined}
          duration={2000}
          style={styles.middle}>
          <Text style={styles.titleText}>
            Viaja a cualquier lugar con la app de Door
          </Text>
          <Text style={styles.middleText}>
            Door es una plataforma con la que puedes gestionar viajes, puedes
            solicitar una entrega de la misma manera que solicitas un viaje,
            observa el artículo mientras se dirige al destinatario y recibe una
            notificación cuando se entregue.
          </Text>
        </Animatable.View>
        <Animatable.View
          animation={animationCompleted ? 'fadeInUp' : undefined}
          duration={2000}
          style={styles.footer}>
          <Button
            mode="contained"
            onPress={() => handleLogin()}
            style={styles.button}
            labelStyle={styles.buttonLabel}>
            Bienvenido
          </Button>
        </Animatable.View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(9, 44, 76, 0.6)',
  },
  header: {
    flex:1,
    justifyContent:'center',
  },
  middle: {
    flex: 1,
    justifyContent: 'flex-start',
    marginHorizontal: 25,
    opacity:0,
    position:'absolute'
  },
  titleText:{
    fontSize: 32,
    color: 'rgba(255, 255, 255, 1)',
    textAlign: 'center',
    fontWeight:'bold',
    marginBottom:20,
    marginTop:20
  },
  middleText: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 1)',
    textAlign: 'center'
  },
  footer: {
    width: '100%', 
    paddingHorizontal: 20, 
    position: 'absolute', 
    bottom: 0, 
    zIndex: 1,
    marginBottom: '3%',
    opacity:0
  },
  button: {
    width:'100%',
    backgroundColor:'rgba(173, 216, 230, 1)',
    borderRadius:8,
    height: 50,
    justifyContent: 'center'
  },
  buttonLabel: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold'
  }
});

export default Welcome;
