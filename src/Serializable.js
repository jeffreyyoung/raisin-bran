import getType from './getType';
import makeSerializable from './makeSerializable';
export default class Serializable {
  constructor(schema, factory, options) {
    if (schema) { this.schema = schema;}
    if (factory) { this.factory = factory;}
    if (options) { this.options; }
  }

  define(schema, factory, options) {
    if (schema) { this.schema = schema;}
    if (factory) { this.factory = factory;}
    if (options) { this.options = options; }
  }

  factory(context) {
    if (this._factory) {return this._factory(context)}
    return {};
  }

  serialize(value, context) {
    if (!value) { return;}
    let json = {};
    Object.entries(this.schema).forEach(([key, subSchema]) => {
      if (value.hasOwnProperty(key)) {
        json[key] = getType(subSchema).serialize(value[key], context);
      }
    });
    return json;
  }

  deserialize(json, context) {
    if (!json) { return; }
    const m = this.factory(context, json);
    Object.entries(this.schema).forEach(([key, subSchema]) => {
      if (json.hasOwnProperty(key)) {
        m[key] = getType(subSchema).deserialize(json[key], context);
      }
    });
    return m;
  }
}

Serializable.decorate = function (clazz, schema, options) {
  makeSerializable(clazz, new this(schema, () => new clazz(), options));
}
