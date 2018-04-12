import getType from '../getType';
export default (schema) => {
  return {
    serialize(value, context) {
      if (!value) { return; }
      let json = {};
      Object.entries(schema).forEach(([key, subSchema]) => {
        if (value.hasOwnProperty(key)) {
          json[key] = getType(subSchema).serialize(value[key], context);
        }
      });
      return json;
    },
    deserialize(json, context) {
      if (!json) { return; }
      const m = {};
      Object.entries(schema).forEach(([key, subSchema]) => {
        if (json.hasOwnProperty(key)) {
          m[key] = getType(subSchema).deserialize(json[key], context);
        }
      });
      return m;
    }
  }
}