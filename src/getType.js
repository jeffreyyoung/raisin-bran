import * as types from './types/index';
import Serializable from './Serializable';

export default function getType(schema) {
  if (Array.isArray(schema)) {
    return types.list(getType(schema[0]))
  } else if (Serializable.isPrototypeOf(schema)) {
    return schema;
  } else if (schema instanceof Serializable) {
    return schema;
  } else if (typeof schema === 'object' && Object.keys(schema).length > 0) {
    return types.object(schema);
  } else if (typeof schema === 'object') {
    return types.raw(schema);
  } else if (schema === String) {
    return types.primitive(schema);
  } else if (schema === Boolean) {
    return types.primitive(schema);
  } else if (schema === Number) {
    return types.primitive(schema);
  } else {
    throw 'unknown type'
  }
}