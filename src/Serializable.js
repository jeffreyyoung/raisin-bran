import getType from './getType';
import makeSerializable from './makeSerializable';
import makeSerializableLazy from './makeSerializableLazy';
export default class Serializable {
  constructor(schema, options, factory) {
    this.options = {};
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

  beforeSerialize(value, context) {
    if (this.options.beforeSerialize) {
      return this.options.beforeSerialize(value, context);
    }
    return value;
  }

  afterSerialize(json, context) {
    if (this.options.afterSerialize) {
      return this.options.afterSerialize(json, context);
    }
    return json;
  }

  serialize(value, context) {
    if (!value) { return;}
    value = this.beforeSerialize(value, context);
    
    let json = {};
    Object.entries(this.schema).forEach(([key, subSchema]) => {
      if (value.hasOwnProperty(key)) {
        json[key] = getType(subSchema).serialize(value[key], context);
      }
    });
    json = this.afterSerialize(json, context);
    return json;
  }
  
  beforeDeserialize(json, context) {
    if (this.options.beforeDeserialize) {
      return this.options.beforeDeserialize(json, context);
    }
    return json;
  }
  
  afterDeserialize(model, context) {
    if (this.options.afterDeserialize) {
      return this.options.afterDeserialize(model, context);
    }
    return model;
  }
  
  deserialize(json, context) {
    if (!json) { return; }
    json = this.beforeDeserialize(json, context);
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
