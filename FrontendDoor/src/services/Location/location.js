import { fethData } from "../../api/fetchData"
import {API_ENDPOINT_DOOR} from '@env';

export const getCityForLocation = async (lat,lng) => {
  try {
    const response = await fethData(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
      'GET',
      {},
      null,
      {},
    );

    let address = response.address;
    let city = 
    address.city?.replace("Perímetro Urbano ", "") || // Quitar prefijo si es necesario
    address.town || 
    address.village || 
    address.state;
    console.log('response:::',JSON.stringify(response))
    console.log(city)
    address['county'] = city
    console.log('county',address)
    return address
  } catch (error) {
    console.log(':::error', error);
    return null;
  }
};


export const getLocations = async () => {
  try {
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: {},
    };
    const response = await fethData(
      `${API_ENDPOINT_DOOR}/Rutas/ObtenerUbicaciones`,
      'GET',
      options.body,
      null,
      options.headers,
    );
    return response;
  } catch (error) {
    console.log('Ha ocurrido un error', error);
    return [];
  }
};