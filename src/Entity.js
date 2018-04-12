import Serializable from './Serializable';

export default class Entity extends Serializable {
  getIdAttribute() {
    if (this.options && this.options.idAttribute) {
      return this.options.idAttribute;
    } else {
      return 'id';
    }
  }

  serialize(value, context) {
    const idAttribute = this.getIdAttribute();
    if (context.visited.has(value)) {
      return {
        [idAttribute]: value[idAttribute]
      }
    } else {
      context.visited.add(value);
      return super.serialize(value, context);
    }
  }
}