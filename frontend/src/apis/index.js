import { parseTo } from 'utils';

const BASE_PATH = window.location.protocol + '//' + window.location.host;

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
  const result = await customFetchFn('/api/events');
  return parseTo()(result);
};
const postEvent = async (event, authToken) => {
  const result = await customFetchFn(
    '/api/events',
    { method: 'POST', body: parseTo('snake')(event) },
    authToken,
  );
  return parseTo()(result);
};
const putEvent = async (event, authToken) => {
  const result = await customFetchFn(
    '/api/events/' + event.id,
    { method: 'PUT', body: parseTo('snake')(event) },
    authToken,
  );
  return parseTo('camel')(result);
};

const login = (username, password) => {
  return customFetchFn('/api/auth/login', {
    method: 'POST',
    body: {
      username,
      password,
    },
  });
};

const validateUserToken = (userId, authToken) => {
  return customFetchFn(`/api/user/${userId}`, {}, authToken);
};

const getPaymentRedirectUrl = orderInfo => {
  return customFetchFn('/api/payments/make-payment', {
    method: 'POST',
    body: orderInfo,
  });
};

const postReservation = orderInfo => {
  return customFetchFn(`/api/reservations`, {
    method: 'POST',
    body: orderInfo,
  });
};

const getReservations = async () =>
  parseTo('camel')(await customFetchFn(`/api/reservations`));

export {
  fetchEvents,
  postEvent,
  putEvent,
  login,
  getPaymentRedirectUrl,
  validateUserToken,
  postReservation,
  getReservations,
};
