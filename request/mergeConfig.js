import { isNullOrUndef, isObject, isArray } from './is.js'

export function mergeConfig(config1, config2 = {}) {
  let config = {};
  function valueFromConfig(prop) {
    return config2[prop] ? config2[prop] : config1[prop] ? config1[prop] : null
  }

  function valueFromConfig2(prop) {
    return typeof config2[prop] === 'boolean' ? config2[prop] : typeof config1[prop] === 'boolean' ? config1[prop] : null
  }

  const mergeMap = {
    'url': valueFromConfig,

    'data': () => {
      if (isObject(config1.data) && isObject(config2.data)) {
        return { ...config1.data, ...config2 }
      } else {
        return config2.data
      }
    },
    'baseUrl': valueFromConfig,
    'header': () => {
      return merge(config1.header, config2.header)
    },
    'timeout': valueFromConfig,
    'dataType': valueFromConfig,
    'responseType': valueFromConfig,
    'enableHttp2': valueFromConfig2,
    'enableQuic': valueFromConfig2,
    'enableCache': valueFromConfig2,
    'enableHttpDNS': valueFromConfig2,
    'httpDNSServiceId': valueFromConfig,
    'enableChunked': valueFromConfig2,
    'forceCellularNetwork': valueFromConfig2,
  };

  for (const key in mergeMap) {
    if (Object.hasOwnProperty.call(mergeMap, key)) {
      const merge = mergeMap[key]
      const configValue = merge(key)
      !isNullOrUndef(configValue) && (config[key] = configValue)
    }
  }
  return config
}


function merge() {
  const result = {}

  function assignValue(val, key) {
    if (isObject(result[key]) && isObject(val)) {
      result[key] = merge(result[key], val)
    } else if (isObject(val)) {
      result[key] = merge({}, val)
    } else if (isArray(val)) {
      result[key] = val.slice()
    } else {
      result[key] = val
    }
  }

  for (let i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }

  return result
}

function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

