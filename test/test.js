const assert = require('assert');
const raisinBran = require('..');
import test from 'ava';

test('should serealize primitive', t => {
	t.is(false, raisinBran.serialize(false, Boolean));
	t.is(true, raisinBran.serialize(true, Boolean));
	t.is('hey', raisinBran.serialize('hey', String));
	t.is(8, raisinBran.serialize(8, Number));
});

test('should deserealize primitive', t => {
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