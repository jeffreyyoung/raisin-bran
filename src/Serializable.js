import getType from './getType';
import makeSerializable from './makeSerializable';
import makeSerializableLazy from './makeSerializableLazy';
export default class Serializable {
  constructor(schema, options, factory) {
    if (schema) { this.schema = schema;}
    if (factory) { this.factory = factory;}
    if (options) { this.options; }
  }

  define(schema, factory, options) {
    if (schema) { this.schema = schema;}
    if (factory) { this.factory = factory;}
    if (options) { this.options = options; }
  }

  factory(context, json) {
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

Serializable.decorate = function (clazz, schema, options, factory) {
  const getOptions = () => ({schema, options, factory});
  this.decorateLazy(clazz, getOptions);
}

Serializable.decorateLazy = function (clazz, getOptions) {
  const getSerializable = () => {
    const options = getOptions();
    let defaultFactory = () => new clazz();
    const defaults = {
      factory: options.factory || defaultFactory,
      schema: options.schema,
      options: options.options
    }
    return new this(defaults.schema, defaults.options, defaults.factory);
  }
  
  makeSerializableLazy(clazz, getSerializable)
}
