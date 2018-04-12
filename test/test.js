const assert = require('assert');
const cereal = require('..');
import test from 'ava';

test('should serealize primitive', t => {
	t.is(false, cereal.serialize(false, Boolean));
	t.is(true, cereal.serialize(true, Boolean));
	t.is('hey', cereal.serialize('hey', String));
	t.is(8, cereal.serialize(8, Number));
});

test('should deserealize primitive', t => {
	t.is(false, cereal.deserialize(false, Boolean));
	t.is(true, cereal.deserialize(true, Boolean));
	t.is('hey', cereal.deserialize('hey', String));
	t.is(8, cereal.deserialize(8, Number));
});

test('should handel raw objects', t => {
	t.deepEqual({yar: 'meow'}, cereal.serialize({yar: 'meow'}, {}));
});

test('should not serialize extra properties', t => {
	t.deepEqual({'albus':'dumbledore'}, cereal.serialize({'albus': 'dumbledore', 'luna': 'lovegood'}, {'albus': String}));
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
	const userSerializer = new cereal.Serializable();
	userSerializer.factory = () => new User();
	userSerializer.define({
		id: String,
		friends: [userSerializer]
	});

	const deserialized = cereal.deserialize(harry, userSerializer);
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
	}, cereal.serialize(deserialized, userSerializer));
});

test('entity should handle circular dependencies', t => {
	const userEntity = new cereal.Entity();
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
		cereal.serialize(voldemort, userEntity)
	);
	
	
});