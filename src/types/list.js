export default (type) => {
  return {
    serialize(value, context) {
      //duck type check the value incase of mobx or some other observable array
      if (value && value.map) {
        return value.map(v => type.serialize(v, context));
      } else {
        return;
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