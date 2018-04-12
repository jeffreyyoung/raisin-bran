# Simple javascript serialization deserialization library

I had trouble finding a simple library to convert my graphql responses from json into mobx classes. 
* more examples can be seen in test/test.js
* see src/Entity.js for an example on how to extend Serializable for more customizability

`npm i --save raisin-bran`


example: 
```javascript

import raisinBran from 'raisin-bran'

class User {};

const userSerializer = new raisinBran.Serializable();
userSerializer.define(
  {
    id: String,
    name: String,
    friends: [userSerializer]
   }, //first arg is schema
  (context, json) => new User() //second arg is factory method, if we wanted we could do lookups in an entity store so that all users with id: n have the same instance
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

console.log(deserialized.result.users[0] instanceof User) //true

const serialized = raisinBran.serialize(deserialized, gqlSchema);


```
