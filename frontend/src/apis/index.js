import { parseTo } from '../utils';

const BASE_PATH = 'http://' + window.location.host;

const myFetch = async (url, config = {}, authToken) => {
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
  const result = await myFetch('/events');
  return parseTo()(result);
};
const postEvent = async (event, authToken) => {
  const result = await myFetch(
    '/events',
    { method: 'POST', body: parseTo('snake')(event) },
    authToken,
  );
  return parseTo()(result);
};
const putEvent = async (event, authToken) => {
  const result = await myFetch(
    '/events/' + event.id,
    { method: 'PUT', body: parseTo('snake')(event) },
    authToken,
  );
  return parseTo('camel')(result);
};

const login = (username, password) => {
  return myFetch('/auth/login', {
    method: 'POST',
    body: {
      username,
      password,
    },
  });
};

export { fetchEvents, postEvent, putEvent, login };

fetch('http://fasttrack.herokuapp.com/bucecarlus/abatare', {
  credentials: 'omit',
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
  },
  referrerPolicy: 'no-referrer-when-downgrade',
  body: null,
  method: 'GET',
  mode: 'cors',
});

let pointer = 'abatare';

const fetchRacer = async (start = 'abatare') => {
  let result;
  let fetchResult;

  try {
    const response = await fetch('http://fasttrack.herokuapp.com/' + start, {
      credentials: 'omit',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      referrerPolicy: 'no-referrer-when-downgrade',
      body: null,
      method: 'GET',
      mode: 'cors',
    });

    fetchResult = response;

    const json = await response.json();
    result = json.next;

    console.log('Result json was', json);
    fetchRacer(result);
  } catch (err) {
    console.log(err);
    console.log('last pointer was ', result);
    console.log('last fetch data', fetchResult);
    return 'end';
  }
};

fetchRacer();
