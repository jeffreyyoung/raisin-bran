export default () => {
  return {
    serialize(value, context) {
      return value;
    },
    deserialize(json, context) {
      return json;
    }
  }
}