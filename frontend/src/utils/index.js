import { inject, observer } from 'mobx-react';
const genRandomKey = () => {
  let S4 = () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (
    S4() +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    S4() +
    S4()
  );
};

const toRgba = rgbaArray => `rgba(${rgbaArray.join(',')})`;
const connect = (...stores) => component => {
  return inject(...stores)(observer(component));
};
export { genRandomKey, toRgba, connect };
