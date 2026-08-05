import { OneSignal } from "react-native-onesignal";
import { fethData } from "../../api/fetchData";
import {API_KEY_NOTIFICATION,API_KEY_ONE_SIGNAL} from '@env'
import { generateCode } from "../../utils/Utils";

export const sendNotificacion = async (userId, message) => {
  try {
    const url = 'https://onesignal.com/api/v1/notifications';
    const apiKey = API_KEY_NOTIFICATION;

    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Basic ${apiKey}`,
      },
      body: {
        app_id: API_KEY_ONE_SIGNAL,
        include_subscription_ids: [userId],
        contents: {es: message,en:message},
        android: {
          notification_icon: "ic_launcher-playstore"
        }
      },
    };
    const response = await fethData(url, 'POST', options.body, apiKey);
    console.log('response', response);
    return response
  } catch (error) {
    console.log('Error al enviar la notificacion:', error);
  }
};

export const getData = async (userId) => {
  const apiKey = API_KEY_NOTIFICATION;
  const url = `https://api.onesignal.com/apps/636af5a5-6615-46f5-899d-c81062b5ea56/users/by/doorApp/${userId}`
  const response = await fethData(url, "GET", { accept: 'application/json' }, apiKey)
  return {
    suscriptionId: response.subscriptions[0].id,
    phoneNumber: response.identity.number
  }
}


export const getNotification = async  (idNotification) =>{
    const url = `https://api.onesignal.com/notifications/${idNotification}?app_id=636af5a5-6615-46f5-899d-c81062b5ea56`
    const apiKey = 'MzMwNGRkMDgtYjMyNC00ODIwLWJkZjgtOTJjZThkMjE4MGVm'; 
    const response = await fethData(url,"GET",{},apiKey)
    console.log('response',response)
}


export const generateCodeAndNotification = async (number) => {
  const code = generateCode();
  const userId = await OneSignal.User.getOnesignalId();
  const { suscriptionId, phoneNumber } = await getData(userId);
  if (!phoneNumber) {
    await OneSignal.User.addAlias("number", number?.replace(/\D/g, ''))
    await OneSignal.User.addTag('phoneNumber',number?.replace(/\D/g, ''))
  }
  console.log('number',number)
  console.log('phoneNumber',phoneNumber)
  if( phoneNumber === number || !phoneNumber){
    const notification = await sendNotificacion(
      suscriptionId,
      `El codigo de verificacion para iniciar sesion es: ${code}`,
    );
    return {notification, code}
  }
  return { notification: 'Codigo invalido', code }
};
