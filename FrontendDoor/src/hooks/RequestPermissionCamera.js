import { PermissionsAndroid } from 'react-native';

export const requestCameraPermission = async () => {
    try {
        const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        ]);
        if (
            granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED
        ) {
            console.log('Permisos concedidos');
            return true
        } else {
            console.log('Al menos uno de los permisos fue denegado');
            return false
        }
    } catch (err) {
        console.warn(err);
    }
};