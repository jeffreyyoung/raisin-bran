const assert = require('assert');
const raisinBran = require('..');
import test from 'ava';

test('before serialize should work', t => {
	class User {};
	raisinBran.Serializable.decorateLazy(User, () => ({
		schema: {
			foo: String
		},
		options: {
			beforeSerialize(json) {
				return {
					foo: json.bar
				}
			},
			afterDeserialize(json) {
				return {
					bar: json.foo
				}
			}
		}
	}));
	
	const j = new User();
	j.bar = 'hey';
	t.deepEqual({ foo: 'hey' }, raisinBran.serialize(j));
	const deserialized = raisinBran.deserialize({foo: 'hey'}, User);
	t.is(deserialized.bar, 'hey');
	
})

test('should serealize primitive', t => {
	t.is(false, raisinBran.serialize(false, Boolean));
	t.is(true, raisinBran.serialize(true, Boolean));
	t.is('hey', raisinBran.serialize('hey', String));
	t.is(8, raisinBran.serialize(8, Number));
});

test('should deserialize primitive', t => {
	t.is(false, raisinBran.deserialize(false, Boolean));
	t.is(true, raisinBran.deserialize(true, Boolean));
	t.is('hey', raisinBran.deserialize('hey', String));
	t.is(8, raisinBran.deserialize(8, Number));
});

test('should handel raw objects', t => {
	t.deepEqual({yar: 'meow'}, raisinBran.serialize({yar: 'meow'}, {}));
});

test('should not serialize extra properties', t => {
	t.deepEqual({'albus':'dumbledore'}, raisinBran.serialize({'albus': 'dumbledore', 'luna': 'lovegood'}, {'albus': String}));
});

test('should handle classes', t => {
	class User {};
	const harry = new User();
	harry.garbage = 'yeeeehaw';
	harry.id = 'harry';
	harry.friends = [];

	const ron = new User();
	ron.id = 'ron';
	harry.friends.push(ron);
	const userSerializer = new raisinBran.Serializable();
	userSerializer.factory = () => new User();
	userSerializer.define({
		id: String,
		friends: [userSerializer]
	});

	const deserialized = raisinBran.deserialize(harry, userSerializer);
	t.is(true, deserialized instanceof User);
	t.is(deserialized.id, 'harry');
	t.is(deserialized.friends[0].id, 'ron');
	t.is(true, deserialized.friends[0] instanceof User);
	t.is(deserialized.garbage, undefined);
	t.deepEqual({
		id: 'harry',
		friends: [{
			id: 'ron'
		}]
	}, raisinBran.serialize(deserialized, userSerializer));
});

test('entity should handle circular dependencies', t => {
	const userEntity = new raisinBran.Entity();
	userEntity.define({
		name: String,
		friends: [userEntity]
	}, () => ({}), {idAttribute: 'name'});
	const voldemort = {
		name: 'voldemort',
		friends: []
	}
	voldemort.friends.push(voldemort);
	
	t.deepEqual(
		{ name: 'voldemort', friends: [ { name: 'voldemort' } ] },
		raisinBran.serialize(voldemort, userEntity)
	);
});

test('should handle deeply nested serializables', t => {
	class User {};
	const userSerializer = new raisinBran.Serializable();
	userSerializer.define(
		{id: String, name: String, friends: [userSerializer]}, //first arg is schema
		() => new User() //second arg is factory method
	);
	
	const graphqlResponse = {
		result: {
			users: [{
				id: 1,
				name: 'albus dumbledore',
				friends: [{
					id: 2,
					name: 'harry potter',
				}],
			},{
				id: 3,
				name: 'hermione granger'
			}]
		}
	};
	
	const gqlSchema = {
		result: {
			users: [userSerializer]
		}
	};
	
	const deserialized = raisinBran.deserialize(graphqlResponse, gqlSchema);
	t.is(true, deserialized.result.users[0] instanceof User);
	const serialized = raisinBran.serialize(deserialized, gqlSchema);
});

test('decorate should work', t => {
	class User {};
	raisinBran.Entity.decorate(User, {
		id: String,
		friends: [User]
	});

	const jim = new User();
	jim.id = 'asdf';
	jim.friends = [jim];
	const serialized = raisinBran.serialize(jim);
	t.deepEqual(serialized, {id: 'asdf', friends: [{id: 'asdf'}]});
	const deserialized = raisinBran.deserialize(serialized, User);
	t.is(true, deserialized instanceof User);
	t.is(true, deserialized.friends[0] instanceof User);
})

test('decorateLazy should work', t => {
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
	
	const json = raisinBran.serialize(group1);
	const g = raisinBran.deserialize(json, Group, {entities});
	t.is(g, g.members[0].groups[0]);
	t.is(g.members[0], g.members[0]);
	const userJson = raisinBran.serialize(g.members[0]);
	const u = raisinBran.deserialize(userJson, User, {entities});
	t.is(u, g.members[0]);
});