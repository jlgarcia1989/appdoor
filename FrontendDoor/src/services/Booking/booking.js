import {fethData} from '../../api/fetchData';
import {API_ENDPOINT_DOOR} from '@env';

export const createBooking = async params => {
  try {
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: {},
    };

    const typeBooking = await getTypeBooking();
    options.body = getBodyBooking(params);
    console.log('body booking::',options.body);
    console.log('paramsss::',params)
    if(typeBooking?.length){
      params.idTipoReserva = typeBooking.find((e=>e.descripcion === params.typeBooking)).idTipoReserva
    }
    console.log('Body:::',options.body)
    const response = await fethData(
      `${API_ENDPOINT_DOOR}/Rutas/CrearReservaRuta`,
      'POST',
      options.body,
      options.headers,
    );
    console.log('Response of createBooking:::', response);
    return response;
  } catch (error) {
    console.log('Ha ocurrido un error', error);
    return null;
  }
};

const getBodyBooking = params => {
  let body = {
    fechaHora: `${params.dateTime}`,
    idUsuario: params.idUsuario,
    idRutaConductor: 8,
    idTipoReserva: 1,
    idEstadoReserva: 1,
    idEncomienda: null,
    descripcion: `${params.origin?.name} - ${params.destination?.name}`,
    cantidadPasajeros: params.passengers,
    direccionOrigen:params.originAddress,
    direccionDestino:params.destinationAddress,
    encomiendas:[]
  };

  if (params?.objects) {
    body.encomiendas = params.objects.map(element => {
      return {
        dimensiones: element.ancho + '/' + element.alto,
        idTipoEncomienda: 1,
        destinatario: params.receiveName,
        telefono: params.phone
      }
    });
    body.idTipoReserva = 2
  }

  return body;
};

export function setHours(fecha) {
  const fechaOriginal = new Date(fecha);
  fechaOriginal.setHours(fechaOriginal.getHours() - 5);
  return fechaOriginal;
}


export const getTypeBooking = async () => {
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
      `${API_ENDPOINT_DOOR}/Rutas/ObtenerTiposReserva`,
      options.method,
      options.body,
      options.headers,
    );
    console.log('Response of getTypeBooking:::', response);
    return response;
  } catch (error) {
    console.log('Ha ocurrido un error', error);
    return null;
  }
};

export const getListBookings = async (body) => {
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
      `${API_ENDPOINT_DOOR}/Rutas/ObtenerReservasPorUsuario?idUsuario=${body.idUsuario}&idtipoUsuario=${body.idtipoUsuario}&idRutaConductor=${body.idRutaConductor}`,
      options.method,
      options.body,
      options.headers,
    );
    console.log('Response of getListBookings:::', response);
    return response;
  } catch (error) {
    console.log('Ha ocurrido un error', error);
    return null;
  }
};

export const cancelBookingForId = async (idBooking) => {
  try {
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: {},
    };
    const response = await fethData(
      `${API_ENDPOINT_DOOR}/Rutas/CancelarReservaRuta?idReservaRuta=${idBooking}`,
      options.method,
      options.body,
      options.headers,
    );
    console.log('Response of cancelBookingForId:::', response);
    return response;
  } catch (error) {
    console.log('Ha ocurrido un error', error);
    return null;
  }
}