import { inject, observer } from 'mobx-react';
import traverse from 'traverse';
import toSnakeCase from 'to-snake-case';
import toCamelCase from 'to-camel-case';
import equal from 'lodash.isequal';

// front-end transfromer. Accepts
// @params caseType = 'snake' | any
// return Object
// if snake, transform deeply an object's keys from any cases to snakecase
// otherwise, to camelCase
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

// generate random UUID
// return String
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

// pluck attribute 'id'
// @params item = Object
// return Object
const removeId = item => {
  const { id, ...itemClone } = item;
  return itemClone;
};

// deeply pluck all attributes 'id' from object, even children
// and descendants
// @params item = Object
// return Object
const removeIdRecursively = item =>
  traverse(item).map(obj => {
    if (obj instanceof Array) return obj;
    if (obj instanceof Object) {
      return removeId(obj);
    } else return obj;
  });
// convert to css rgba color syntax
// return CSSRgbaString
const toRgba = rgbaArray => `rgba(${rgbaArray.join(',')})`;
// create a function that connect react component to specified store
// @params: ...stores = String[]
// return (component: ReactComponent) => InjectedReactComponent
const connect = (...stores) => component => {
  return inject(...stores)(observer(component));
};
// make an object pipeable
// @params: obj = Object
// returnn Object
const pipeable = obj => {
  const clone = obj instanceof Array ? [...obj] : { ...obj };
  // apply a list of PURE transformer to this object
  // @params: ...funcList = Function[]
  // return any
  const pipe = (...funcList) =>
    funcList.reduce(
      (resultFromLast, currentFunc) => currentFunc(resultFromLast),
      clone,
    );
  return {
    pipe,
  };
};

// create a function that clamp a value to a range of min and max
// @params: min = Number, max = Number
// return (value: Number) => Number
const clamp = (min, max) => num => {
  if (typeof num != 'number') return min;
  return Math.max(min, Math.min(num, max));
};

export {
  genRandomKey,
  toRgba,
  connect,
  pipeable,
  parseTo,
  removeIdRecursively,
  clamp,
};
