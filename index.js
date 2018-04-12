import raisinBran from './src/main.js';
class User {};
class Group {};

raisinBran.Entity.decorateLazy(User, () => ({
  schema: {
    id: String,
    groups: [Group]
  },
  factory: (context, json) => getEntity(User, context, json)
}));

raisinBran.Entity.decorateLazy(Group, () => ({
  schema: {
    id: String,
    members: [User]
  },
  factory: (context, json) => getEntity(Group, context, json)
}));

//entity Cache
function getEntity(EntityClass, context, json) {
  let entitiesOfClass = context.entities[Symbol.for(EntityClass)];
  if (!entitiesOfClass[json.id]) {
    entitiesOfClass[json.id] = new EntityClass();
  }
  return entitiesOfClass[json.id]
}
const group1 = new Group();
group1.id = '1';
group1.members = [];
const user1 = new User();
user1.id = '1';
user1.groups = [group1];
group1.members = [user1];

//entityCache
const entities = {
  [Symbol.for(User)]: {},
  [Symbol.for(Group)]: {}
};
console.log('GROUP1', group1);
const json = raisinBran.serialize(group1);
window.d = raisinBran.deserialize(json, Group, {entities});
console.log(window.d);