import * as types from './types/index';
import Serializable from './Serializable';

export default function getType(schema) {
  let serializable;
  if (Array.isArray(schema)) {
    serializable = types.list(getType(schema[0]))
  } else if (Serializable.isPrototypeOf(schema)) {
    serializable = schema;
  } else if (schema instanceof Serializable) {
    serializable = schema;
  } else if (getTypeFromConstructor(schema)) {
    serializable = getTypeFromConstructor(schema);
  } else if (getTypeFromClass(schema)) {
    serializable = getTypeFromClass(schema);
  } else if (typeof schema === 'object' && Object.keys(schema).length > 0) {
    serializable = types.object(schema);
  } else if (typeof schema === 'object') {
    serializable = types.raw(schema);
  } else if (schema === String) {
    serializable = types.primitive(schema);
  } else if (schema === Boolean) {
    serializable = types.primitive(schema);
  } else if (schema === Number) {
    serializable = types.primitive(schema);
  } else {
    throw 'unknown type for: ' + schema;
  }
  return serializable;
}

export function getTypeFromClass(schema) {
  if (schema && schema.$serializable) {
    return schema.$serializable
  }
}

export function getTypeFromConstructor(thing) {
  if (thing && thing.constructor && thing.constructor.$serializable) {
    return thing.constructor.$serializable;
  }
}