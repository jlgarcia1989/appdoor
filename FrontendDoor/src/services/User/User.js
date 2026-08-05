import {fethData, fethFormData} from '../../api/fetchData';
import {API_ENDPOINT_DOOR} from '@env';

export const userExist = async phoneNumber => {
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
      `${API_ENDPOINT_DOOR}/Usuarios/ObtenerUsuario?numeroCelular=${phoneNumber}`,
      'GET',
      options.body,
      null,
    );
    console.log('Response of userExist:::', response);
    return response;
  } catch (error) {
    console.log('Ha ocurrido un error', error);
    return null;
  }
};

export const createUser = async body => {
  try {
    let data = new FormData();

    let bodyUser = body?.esConductor ? getBodyDriver(body) : getBodyUser(body);

    Object.keys(bodyUser).forEach(key => {
      data.append(key, bodyUser[key]);
    });

    console.log('data:::',data)

    const response = await fethFormData(
      `${API_ENDPOINT_DOOR}/Usuarios/CrearUsuario`,
      'post',
      data,
      null,
      {
        'accept': '*/*',
        'Content-Type': 'multipart/form-data',
      },
    );
    console.log('Response of createUser:::', response);
    return response;
  } catch (error) {
    console.log('Ha ocurrido un error', error);
    return null;
  }
};

export const editUser = async body => {
  try {
    let data = new FormData();

    let bodyUser = getBodyUser(body);
    
    bodyUser['idUsuario'] = body.idUsuario

    console.log(bodyUser)
    Object.keys(bodyUser).forEach(key => {
      data.append(key, bodyUser[key]);
    });

    const response = await fethFormData(
      `${API_ENDPOINT_DOOR}/Usuarios/EditarUsuario`,
      'PUT',
      data,
      null,
      {
        'Content-Type': 'multipart/form-data',
      },
    );
    console.log('Response of editUser:::', response);
    return response;
  } catch (error) {
    console.log('Ha ocurrido un error', error);
    return null;
  }
};

export const getTypesUsers = async () => {
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
      `${API_ENDPOINT_DOOR}/Usuarios/ObtenerTiposUsuario`,
      'GET',
      options.body,
      null,
      options.headers
    );
    console.log('Response of getTypesUsers:::', response);
    return response;
  } catch (error) {
    console.log('Ha ocurrido un error', error);
    return null;
  }
};


const getBodyUser = body => {
  const splitName = body.lastName?.split(' ');

  let bodyUser = {
    nombre: body.name,
    primerApellido: '',
    segundoApellido: '',
    activo: true,
    numeroCelular: body.numeroCelular ? body.numeroCelular : body.phoneNumber,
    correo: body.correo,
    direccion: body.direccion,
    numeroIdentificacion: body.numeroIdentificacion,
    fechaNacimiento: body.fechaNacimiento,
    idTipoUsuario: 1
  };

  if (splitName?.length >= 2) {
    bodyUser.primerApellido = splitName[0];
    bodyUser.segundoApellido = splitName[1];
  } else {
    bodyUser.primerApellido = splitName[0];
  }

  if (body.imageProfile) {
    bodyUser['archivos'] = {
      uri: body.imageProfile.uri,
      type: body.imageProfile.type,
      name: body.imageProfile.fileName,
    };
  } else {
    bodyUser['urlImagen'] = body.urlImagen;
  }
  
  return bodyUser;
};

const getBodyDriver = body => {
  let bodyDriver = {
    nombre: body.nombre,
    primerApellido: body?.primerApellido,
    segundoApellido: body?.segundoApellido ? body?.segundoApellido : '',
    activo: true,
    numeroCelular: body.numeroCelular ? body.numeroCelular : body.phoneNumber,
    correo: body.correo,
    direccion: body.direccion,
    numeroIdentificacion: body.numeroIdentificacion,
    fechaNacimiento: body.fechaNacimiento,
    idTipoUsuario: 2,
    urlImagen: body.urlImagen
  };


  return bodyDriver;
}

export const disabledUser = async (idUser,isActive) => {
  try {
    const options = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: {},
    };
    const response = await fethData(
      `${API_ENDPOINT_DOOR}/Usuarios/ActivarUsuario?idUsuario=${idUser}&activo=${isActive}`,
      options.method,
      options.body,
      null,
    );
    console.log('Response of disabledUser:::', response);
    return response;
  } catch (error) {
    console.log('Ha ocurrido un error', error);
    return null;
  }
};
