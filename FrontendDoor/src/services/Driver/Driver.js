import {fethData, fethFormData} from '../../api/fetchData';
import {API_ENDPOINT_DOOR} from '@env';


export const editDriver = async body => {
  try {
    let data = new FormData();

    let bodyUser = getBodyDriver(body);
    
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


export const uploadFiles = async body => {
  try {
    let data = new FormData();
    
    let bodyDriver = getUploadDriver(body);
    
    bodyDriver['idUsuario'] = body.idUsuario

    Object.keys(bodyDriver).forEach(key => {
        if (key === 'archivos') {
          bodyDriver[key].forEach(file => {
            data.append('archivos', {
              uri: file.uri,
              type: file.type,
              name: file.name,
            });
          });
        } else {
          data.append(key, bodyDriver[key]);
        }
      });

    const response = await fethFormData(
      `${API_ENDPOINT_DOOR}/Usuarios/GuardarDocumentos`,
      'POST',
      data,
      null,
      {
        'Content-Type': 'multipart/form-data',
      },
    );
    console.log('Response of createDriverDouments:::', response);
    return response;
  } catch (error) {
    console.log('Ha ocurrido un error', error);
    return null;
  }
};

const getUploadDriver = body => {
  console.log('este es el body', body)
  const bodyUser = {
    archivos: [],
    IdInformacionDocumento: body?.IdInformacionDocumento,
    IdTipoDocumento: body?.IdTipoDocumento,
    placa: body?.placa,
    licencia: body?.licencia,
    TipoVehiculo: body?.tipovehiculo,
  }
  if (body.documents) {
    bodyUser['archivos'] = body.documents.map((document) => {
      return {
        uri: document.uri,
        type: document.type,
        name: document.fileName,
      }
    });
  };
  console.log('bodyUser', bodyUser)
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
      idTipoUsuario: 2
    };

    if (body.imageProfile) {
        bodyDriver['archivos'] = {
          uri: body.imageProfile.uri,
          type: body.imageProfile.type,
          name: body.imageProfile.fileName,
        };
      }
  
  
    return bodyDriver;
  }