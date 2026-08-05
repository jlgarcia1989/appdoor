import { useEffect } from 'react';
import {OneSignal,LogLevel} from 'react-native-onesignal';
import {API_KEY_ONE_SIGNAL,API_ONE_SIGNAL_NAME} from '@env'

const useOneSignal = async () => {
  useEffect(() => {
    getPermission();
  }, []);
};

   export const validatePermission = async () => {
     const userId = await OneSignal.User.getOnesignalId();
     const permision = await OneSignal.Notifications.getPermissionAsync();

     if (userId && permision) {
       await OneSignal.User.addAlias("doorApp", userId);
       await OneSignal.User.setLanguage('es');
       return true;
     }
  
     await getPermission();
     return false;
   }; 


  const getPermission = async () => {
    // Remove this method to stop OneSignal Debugging
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);

    OneSignal.initialize(API_KEY_ONE_SIGNAL);
    // requestPermission will show the native iOS or Android notification permission prompt.
    // We recommend removing the following code and instead using an In-App Message to prompt for notification permission
    OneSignal.Notifications.requestPermission(true);

  };

export default useOneSignal;