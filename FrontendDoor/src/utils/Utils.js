import moment from 'moment';
import 'moment/locale/es';

export function generateCode() {
    const codigo = Math.floor(10000 + Math.random() * 90000);
    return codigo;
}

export function getFullDate(isoDate) {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

export const formatHour = (date) =>{
  const fecha = moment(date);
  return fecha.format('hh:mm a');
}

export const formatDate = (date) =>{
  const fecha = moment(date);
  fecha.locale('es');
  return fecha.format('dddd DD [de] MMMM [de] YYYY');
}

export const mapFiles = (documents) => {
  let files = [];
  console.log(documents)
  for (const tipoDocumento in documents) {
    console.log(tipoDocumento)
    const { frente, reverso } = documents[tipoDocumento];
    if (frente) files.push(frente);
    if (reverso) files.push(reverso);
  }
  console.log('files:::',files)
  return files;
}

export const mapFilesDriver = (documentFiles) => {
  const filesArray = [];

  Object.entries(documentFiles).forEach(([key, value]) => {
    if (key === "Tarjeta de propiedad") {
      if (value.frente) filesArray.push(value.frente);
      if (value.reverso) filesArray.push(value.reverso);
    } else {
      if (value) filesArray.push(value);
    }
  });

  return filesArray;
};

export const messageUser = 'usuario para hacer una reserva?'
export const messageDriver = 'conductor para ofrecer servicios de transporte?'