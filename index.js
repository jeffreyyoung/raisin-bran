import cereal from './src/main.js';

window.cereal = cereal;

class User {};

const userSerializer = new cereal.schema.Object();
userSerializer.factory = context => new User();
userSerializer.define({
  id: String,
  friends: [userSerializer]
});

window.userSerializer = userSerializer;
const u1 = new User();
u1.id = 'hey!';
u1.friends = [];

const u2 = new User();
u2.id = 'meow';
u1.friends.push(u2);

window.yeehaw = () => cereal.serialize(u1, userSerializer);

console.log(cereal.serialize(u1, userSerializer));
console.log(cereal.deserialize(cereal.serialize(u1, userSerializer), userSerializer))
console.log('hiiii');