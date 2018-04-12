export default () => {
  return {
    serialize(value, context) {
      //toJS
      return value;
    },
    deserialize(json, context) {
      return json;
    }
  }
}