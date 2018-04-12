import getType from './getType';
import Serializable from './Serializable';
import Entity from './Entity';

function getContextWithDefaults(context) {
	return Object.assign({}, context, {
		visited: new Set()
	});
}

export function serialize(thing, schema, context = {}) {
  return getType(schema).serialize(thing, getContextWithDefaults(context));
}

export function deserialize(thing, schema, context = {}) {
  return getType(schema).deserialize(thing, getContextWithDefaults(context));
}
export { Serializable };
export {Entity};
export default {
	schema: {
		Object: Serializable
	},
	Entity,
	deserialize,
	serialize
}