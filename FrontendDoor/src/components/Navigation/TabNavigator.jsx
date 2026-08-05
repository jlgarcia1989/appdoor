
import React, { useRef } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Home from "../Home/Home";
import Historical from "../User/Historical";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DrawerLayoutAndroid, View } from "react-native";
import { useAuth } from "../../hooks/AuthContext";
import CustomDrawerContent from "../Drawer/CustomDrawer";
import { useNavigation } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import EditProfile from "../User/EditProfile";
import Bookings from "../User/Bookings";
import HomeDriver from "../Driver/HomeDriver";

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const BottomTabNavigator = () => {
  const navigation = useNavigation();
  const { drawer, closeDrawer, openDrawer } = useAuth();

  return (
    <Drawer.Navigator screenOptions={{
      drawerStyle: {
        backgroundColor: 'transparent',
      },
    }} drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="HomeDrawer" options={{ headerShown: false }}>
        {() => (
          <View style={{ flex: 1, backgroundColor: "rgba(9, 44, 76, 1)" }}>
            <Tab.Navigator
              screenOptions={{
                tabBarStyle: {
                  backgroundColor: "rgba(9, 44, 76, 1)", // Fondo personalizado
                  borderTopWidth: 1, // Borde superior
                  borderTopRightRadius: 40,
                  borderTopLeftRadius: 40,
                  width: '100%',
                  height: 75,
                },
                tabBarLabelStyle: {
                  fontSize: 18,
                  fontWeight: 'bold',
                  marginBottom: 10
                },
                tabBarIconStyle: {
                  marginBottom: -10,
                  marginTop: -10
                },
                tabBarActiveTintColor: '#FFFFFF', // Color activo (blanco)
                tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)', // Color inactivo (blanco con opacidad)
              }}
            >
              <Tab.Screen name="Inicio" component={Home} options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <Icon name="home" color={color} size={24} />
                ),
              }}
                initialParams={{ openDrawer, closeDrawer }}
              />

              <Tab.Screen name="Historial" component={Historical} options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <Icon name="map-legend" color={color} size={24} />
                ),
              }} />
              <Tab.Screen name="Reservas" component={Bookings} options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <Icon name="car-clock" color={color} size={24} />
                ),
              }} />
              <Tab.Screen name="Perfil" component={EditProfile} options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <Icon name="account-outline" color={color} size={24} />
                ),
              }} />
              
            </Tab.Navigator>
          </View>
        )}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
};

export default BottomTabNavigator;