import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Badge, IconButton } from 'react-native-paper'
import { SvgXml } from 'react-native-svg';
import { logo_horizontal } from '../../utils/Logo';

export default function Header({ paddingR = 40 }) {
    const navigation = useNavigation();
    return (
        <View style={styles.header}>
            <View style={styles.leftIcons}>
                <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
                    <IconButton icon="menu" size={22} style={styles.menu} iconColor='rgba(79, 79, 79, 1)' />
                </TouchableOpacity>
                <SvgXml
                    xml={logo_horizontal}
                    style={styles.logo}
                    fill="white"
                />
            </View>
            <View style={[styles.rightIcons, { paddingRight: paddingR }]}>
                <IconButton icon="magnify" size={22} style={styles.menu} iconColor='rgba(79, 79, 79, 1)' onPress={() => navigation.navigate('Search')} />
                <View style={styles.notificationIcon}>
                    <IconButton
                        icon="bell"
                        size={22}
                        style={styles.menu}
                        iconColor="rgba(79, 79, 79, 1)"
                        onPress={() => { navigation.navigate('Notifications') }}
                    />
                    <Badge style={styles.badge} >3</Badge>
                </View>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 7,
        marginRight: 5,
        marginLeft: 5
    },
    leftIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    notificationIcon: {
        position: 'relative', // Para que el Badge se posicione relativo al icono
      },
      badge: {
        position: 'absolute',
        top: -4,     // Ajusta según sea necesario
        right: -4,   // Ajusta según sea necesario
        backgroundColor: 'red', // Puedes cambiar el color según tu preferencia
        color: 'white',          // Color del texto del badge
        fontSize: 12,
      },
    menu: {
        color: 'rgba(173, 216, 230, 1)',
        backgroundColor: "rgba(173, 216, 230, 1)",
        borderRadius: 4,
    },
    logo: {
        width: 100,
        height: 22,
        resizeMode: 'contain',
    },

})