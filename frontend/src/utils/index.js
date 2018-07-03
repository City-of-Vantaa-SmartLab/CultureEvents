import { inject, observer } from 'mobx-react';
import traverse from 'traverse';
import toSnakeCase from 'to-snake-case';
import toCamelCase from 'to-camel-case';

const parseTo = caseType => node => {
  const transformer = caseType == 'snake' ? toSnakeCase : toCamelCase;

  return traverse(node).map(obj => {
    if (obj instanceof Array) return obj;

    if (obj instanceof Object) {
      let clone = {};

      Object.keys(obj).forEach(key => (clone[transformer(key)] = obj[key]));
      return clone;
    } else return obj;
  });
};
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
const pipeable = obj => {
  const clone = obj instanceof Array ? [...obj] : { ...obj };
  const pipe = (...funcList) =>
    funcList.reduce(
      (resultFromLast, currentFunc) => currentFunc(resultFromLast),
      clone,
    );
  return {
    pipe,
  };
};

export { genRandomKey, toRgba, connect, pipeable, parseTo };
