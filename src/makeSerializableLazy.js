
export default (clazz, getSerializable) => {
  Object.defineProperty(clazz, '$serializable', {
    get() {
      if (!clazz._$serializable) {
        clazz._$serializable = getSerializable();
      }
      return clazz._$serializable
    }
  });
}