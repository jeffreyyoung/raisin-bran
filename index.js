import raisinBran from './src/main.js';
class User {};
raisinBran.Serializable.decorateLazy(User, () => ({
  schema: {
    foo: String
  },
  options: {
    beforeSerialize(json) {
      console.log('IN BEFORE SERIALIZE!!!');
      return {
        foo: json.bar
      }
    }
  }
}));

const j = new User();
j.bar = 'hey';
console.log('hi!', raisinBran.serialize(j))