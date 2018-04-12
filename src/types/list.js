export default (type) => {
  return {
    serialize(value, context) {
      if (!Array.isArray(value)) {
        return;
      } else {
        return value.map(v => type.serialize(v, context));
      }
    },
    deserialize(json, context) {
      if (!Array.isArray(json)) {
        return;
      } else {
        return json.map(j => type.deserialize(j, context));
      }
    }
  }
}