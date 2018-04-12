import raisinBran from './src/main.js';
class User {};

raisinBran.Entity.decorate(User, {
  id: String,
  friends: User
});

const jim = new User();
jim.id = 'asdf';
jim.friends = [jim];
const serialized = raisinBran.serialize(jim);
const deserialized = raisinBran.deserialize(serialized, User);
console.log('deserialized', deserialized);
window.raisinBran = raisinBran;
window.doThang = () => raisinBran.serialize(jim);
window.doThang1 = () => raisinBran.deserialize(serialized, User);