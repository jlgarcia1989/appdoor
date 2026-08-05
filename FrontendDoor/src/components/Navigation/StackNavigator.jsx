import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Welcome from "../Welcome";
import Home from "../Home/Home";
import Login from "../Login/Login";
import CodeVerify from "../Login/CodeVerify";
import Profile from "../User/Profile";
import { StyleSheet } from "react-native";
import { useAuth } from "../../hooks/AuthContext";
import Address from "../User/Address";
import Historical from "../User/Historical";
import Help from "../User/Help";
import Settings from "../User/Settings";
import About from "../User/About";
import BottomTabNavigator from "./TabNavigator";
import SearchComponent from "../Booking/SearchBooking";
import Notifications from "../User/Notifications";
import { Register } from "../Driver/Register";
import DriverDocuments from "../Driver/DriverDocuments";
import VehicleDocuments from "../Driver/VehicleDocuments";
import VerificationDocuments from "../Driver/VerificationDocuments";
import BottomTabNavigatorDriver from "../NavigationDriver/TabNavigatorDriver";
import FaqScreen from "../User/FaqScreen";

const Stack = createStackNavigator();


const MainStackNavigator = () => {

    const { isAuthenticated } = useAuth();

    return (
        <Stack.Navigator initialRouteName='Welcome'/* {isAuthenticated ? 'Home' : 'Welcome'} */ >
            <Stack.Screen
                name="Welcome"
                component={Welcome}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Home"
                component={BottomTabNavigator}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Login"
                component={Login}
                options={{
                    title: 'Regresar',
                    headerTitleStyle: styles.titleOption,
                }}
            />
            <Stack.Screen
                name="CodeVerify"
                component={CodeVerify}
                options={{
                    title: 'Regresar',
                    headerTitleStyle: styles.titleOption,
                }}
            />
            <Stack.Screen
                name="Profile"
                component={Profile}
                options={{
                    headerTitleStyle: styles.titleOption,
                    headerTitle: 'Perfil',
                    headerTitleAlign: 'center',
                    headerBackTitle: 'Regresar',
                    headerBackTitleVisible: true,
                    headerBackTitleStyle: { marginLeft: 5, fontSize: 18 },
                }}
            />
            <Stack.Screen
                name="EditProfile"
                component={BottomTabNavigator}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Address"
                component={Address}
                options={{
                    title: 'Regresar',
                    headerTitleStyle: styles.titleOption,
                }}
            />
            <Stack.Screen
                name="Historical"
                component={BottomTabNavigator}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="About"
                component={About}
                options={{
                    title: 'Regresar',
                    headerTitleStyle: styles.titleOption,
                }}
            />

            <Stack.Screen
                name="Search"
                component={SearchComponent}
                options={{
                    title: 'Regresar',
                    headerTitleStyle: styles.titleOption,
                }}
            />
            <Stack.Screen
                name="Notifications"
                component={Notifications}
                options={{
                    title: 'Regresar',
                    headerTitleStyle: styles.titleOption,
                }}
            />
            <Stack.Screen
                name="Settings"
                component={Settings}
                options={{
                    title: 'Regresar',
                    headerTitleStyle: styles.titleOption,
                }}
            />
            <Stack.Screen
                name="Faqs"
                component={FaqScreen}
                options={{
                    title: 'Regresar',
                    headerTitleStyle: styles.titleOption,
                }}
            />
            
            <Stack.Screen
                name="Help"
                component={Help}
                options={{
                    title: 'Regresar',
                    headerTitleStyle: styles.titleOption,
                }}
            />

            <Stack.Screen
                name="Driver"
                component={Register}
                options={{
                    title: '',
                    headerTitleStyle: styles.titleOption,
                    headerLeft: () => null
                }}
            />

            <Stack.Screen
                name="DriverDocuments"
                component={DriverDocuments}
                options={{
                    title: 'Regresar',
                    headerTitleStyle: styles.titleOption,
                }}
            />

            <Stack.Screen
                name="VehicleDocuments"
                component={VehicleDocuments}
                options={{
                    title: 'Regresar',
                    headerTitleStyle: styles.titleOption,
                }}
            />

            <Stack.Screen
                name="VerificationDocuments"
                component={VerificationDocuments}
                options={{
                    title: '',
                    headerTitleStyle: styles.titleOption,
                    headerLeft: () => null
                }}
            />

            <Stack.Screen
                name="HomeDriver"
                component={BottomTabNavigatorDriver}
                options={{ headerShown: false }}
            />

        </Stack.Navigator>

    );
}
const styles = StyleSheet.create({
    titleOption: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'rgba(65, 65, 65, 1)rgba(65, 65, 65, 1)',
    },
});

export { MainStackNavigator };
















