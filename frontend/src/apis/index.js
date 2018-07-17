import { parseTo } from '../utils';

const BASE_PATH = 'http://' + window.location.host;

const customFetchFn = async (url, config = {}, authToken) => {
  const response = await window.fetch(BASE_PATH + url, {
    headers: {
      'content-type': 'application/json',
      ...config.headers,
      Authorization: 'Bearer ' + authToken,
    },
    method: config.method || 'GET',
    body: JSON.stringify(config.body),
  });
  if (response.status >= 200 && response.status < 300) {
    if (response.type === 'cors') {
      window.location.href = response.url;
    }
    try {
      return await response.json();
    } catch (error) {
      console.log('Not a json :)');
    }
  } else throw new Error(response.status);
};

const fetchEvents = async () => {
  const result = await customFetchFn('/events');
  return parseTo()(result);
};
const postEvent = async (event, authToken) => {
  const result = await customFetchFn(
    '/events',
    { method: 'POST', body: parseTo('snake')(event) },
    authToken,
  );
  return parseTo()(result);
};
const putEvent = async (event, authToken) => {
  const result = await customFetchFn(
    '/events/' + event.id,
    { method: 'PUT', body: parseTo('snake')(event) },
    authToken,
  );
  return parseTo('camel')(result);
};

const login = (username, password) => {
  return customFetchFn('/auth/login', {
    method: 'POST',
    body: {
      username,
      password,
    },
  });
};

const validateUserToken = (userId, authToken) => {
  return customFetchFn(`/user/${userId}`, {}, authToken);
};

const getPaymentRedirectUrl = orderInfo => {
  return customFetchFn('/payments/make-payment', {
    method: 'POST',
    body: orderInfo,
  });
};

const postReservation = orderInfo => {
  return customFetchFn(`/reservations`, {
    method: 'POST',
    body: orderInfo,
  });
};

export {
  fetchEvents,
  postEvent,
  putEvent,
  login,
  getPaymentRedirectUrl,
  validateUserToken,
  postReservation,
};
