import axios from 'axios';

export const fethData = async (
  url: string,
  method: string,
  body: any,
  authorization: string,
  headers:any
) => {
  let config = {
    method,
    headers: {
      ...headers
    },
    data: {
      ...body,
    },
  };

  if (authorization) {
    config.headers = {
      ...config.headers,
      Authorization: `Basic ${authorization}`,
    };
  }

  try {
    console.log('config',config)
    console.log('url::',url)
    const response = await axios(url, config);
    return response.data
  } catch (errors) {
    console.error('Error:', errors);
  }
};



export const fethFormData = async (
  url: string,
  method: string,
  body: any,
  authorization: string,
  headers:any
) => {
  let config = {
    url,
    method,
    headers: {
      ...headers
    },
    data: body
  };

  if (authorization) {
    config.headers = {
      ...config.headers,
      Authorization: `Basic ${authorization}`,
    };
  }

  try {
    console.log('configgg',config)
    const response = await axios(config);
    return response.data
  } catch (errors) {
    console.error('Error:', errors);
  }
};
    


