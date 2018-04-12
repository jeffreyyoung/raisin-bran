import getType, {getTypeFromConstructor} from './getType';
import Serializable from './Serializable';
import Entity from './Entity';
import makeSerializable from './makeSerializable';
function getContextWithDefaults(context) {
	return Object.assign({}, context, {
		visited: new Set()
	});
}

export function serialize(thing, schema, context = {}) {
	if (!schema) {
		schema = getTypeFromConstructor(thing);
	}

  return getType(schema).serialize(thing, getContextWithDefaults(context));
}

export function deserialize(thing, schema, context = {}) {
  return getType(schema).deserialize(thing, getContextWithDefaults(context));
}
export { Serializable, Entity, makeSerializable };

export default {
	schema: {
		Object: Serializable
	},
	Entity,
	deserialize,
	serialize,
	makeSerializable
}