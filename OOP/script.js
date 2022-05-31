'use strict';

//--------------CONSTRUCTOR FUNCTON-------------------
const Person = function (name, birthYear) {
  console.log(this); //notice how the type of obj is "Person"
  this.name = name;
  this.birthYear = birthYear;

  //Dont do this--> dont put methods in object constructor, if we do this, then
  //every object created will have a copy of this function, will boat the program/website performance
  //Put them in the prototype, that way there will be only one func we refer to
  //   this.calcAge = function () {
  //     console.log(2022 - this.birthYear);
  //   };
};

//---------Static methods------\
/*
These methods are attached to the constructor themselves, not the Constructor.prototype
Hence they can be called only on the constructors.
Eg: Array.from(document.querySelectorAll('h1'))
We can't call this method on an array itself.
Another eg: Number.parseFloat('2.1'); We call this on the Number constructor
To create a static function: Constructor.greet = function() {return "Hello"}
**Since "this" refers to the object calling the function, value of this inside
is the Constructor itself.
This applies to ES6 classes as well and "this" will refer to the whole class, not the object
*/
Person.sayHi = function () {
  console.log(`Hey there`);
  console.log(`static method: ${this}`);
};
Person.sayHi();

const souvik = new Person('Souvik', 1997);
console.log(souvik);
console.log(souvik instanceof Person);
//------> So what happened exactly in the above scenario?
// 1. New empty obj is created with the "new" keyword
// 2. Then function is called, "this" points to empty Person obj
// 3. We set the obj's attributes using "this", like this.name
// souvik.__proto__ = Person.prototype, this is also set here
// 4. Function automatically returns object

//------------------PROTOTYPES------------------
Person.prototype.calcAge = function () {
  console.log(2022 - this.birthYear); //this will refer to the obj calling this prototype func
};

console.log(souvik.__proto__ === Person.prototype);
//Person.prototype refers to the prototype object to be used for all objects created
//from the Person constructor, this is why, in the first one below, it is true while the
//second one is false. Basically, souvik is and object from constructor Person, so the
//object.__proto__ is the object's prototype and on the constructor there is .prototype key
//that refers to prototype for all objects created via this constructor
console.log(Person.prototype.isPrototypeOf(souvik)); //Basically Person.prototype is prototype of linked objects
console.log(Person.prototype.isPrototypeOf(Person));
//We can also link attributes via prototypes, these are different from the object's own properties
Person.prototype.greet = 'Hello'; //prototype's property
console.log(souvik.hasOwnProperty('greet')); //false as it is a prototypal property
console.log(souvik.hasOwnProperty('name')); //true
// Person.prototype.constructor will refer back to Person/constructor func itself

//What is prototype chain?
/*
We have Person.prototype and souvik.__proto__  referring to the same Prototype object. However this prototype
object is also an object and is created from a constructor function, called "Object". 
So Object.prototype === Person.prototype.__proto__. It is this Oject.prototype that has methods like
"hasOwnProperty". When we call hasOwnProperty() on an object,say souvik, it first looks at Person.prototype
then it looks up at Object.prototype and this is the topmost prototype object, if there was one above it
then Js will keep looking UP the chain till a method or attribute is found
*/

//---------------------CODING CHALLENGE: CARS------------------------
console.log('---------Coding Challenge Cars----------');

const Car = function (make, speed) {
  this.make = make;
  this.speed = speed;
};

Car.prototype.accelerate = function () {
  this.speed += 10;
  console.log(`Speed after acceleration is ${this.speed}km/h`);
};

Car.prototype.brake = function () {
  this.speed -= 5;
  console.log(`Speed after braking is ${this.speed}km/h`);
};

let bmw = new Car('BMW', 50);
bmw.accelerate();
bmw.brake();
bmw.accelerate();

//----------------ES6 Classes----------------

//REMEMBER: This is all syntactic sugar; everything is object in Js, class
//work like aboce constructor functions behd the scenes

//class expression
// const PersonCl = class{}

class PersonCl {
  constructor(name, birthYear) {
    this.fullname = name;
    this.birthYear = birthYear;
  }

  calcAge() {
    console.log(2022 - this.birthYear);
  }

  /*More on getters and setters below, read that first
    Setters and Getters can be used to perform input validations.
    We can set the input value after validating. However since an attribute
    is also getting set in the constructor, we will get Memory Error. So we
    change the name of the attribute by prefixing with _, like _name
    and then using a getter with the original variable name to retrieve it
  */
  set fullName(name) {
    if (name.indexOf(' ') > 0) this._fullname = name;
    else alert(`${fullname} is not a full name`);
  }
  //since getter will be used as an attribute, we can use personObj.fullName to get _fullName
  get fullName() {
    return this._fullname;
  }
}

//----IMPORTANT---
// 1. Classes are NOT hoisted, only functions are
// 2. Classes are first class citizens
// 3. Classes are executed in strict mode

//Getters and Setters in Normal JS OBJECTS
//Once defined, they can be used KIND OF LIKE an attribute
console.log('GETTER AND SETTERS-----');
const account = {
  owner: 'Souvik mandal',
  movements: [200, 530, 120, 300],

  //GETTER--> keyword "get" is used to create a getter
  get latest() {
    return this.movements.slice(-1).pop();
  },

  //SETTER with keyword "set"
  set latest(mov) {
    this.movements.push(mov);
  },
};

//Use GETTER like it is an attribute
console.log(account.latest);

account.latest = 50; //SETTER
console.log(account.movements);

//-----------O B J E C T . C R E A T E-----------------
const PersonProto = {
  calcAge() {
    console.log(2022 - this.birthYear);
  },

  init(name, birthYear) {
    this.name = name;
    this.birthYear = birthYear;
  },
};

const steven = Object.create(PersonProto);
steven.init('Steven', 1999);
/*
This creates an Object steven that has an __proto__ referring to the 
PersonProto object. There is no constructor, hence no Contructor.prototype
So we just created and object using another object as its Prototype
*/
console.log(steven.__proto__ === PersonProto); // true

console.log('----------ES6 Classes Coding Challenge------------');

class Car2 {
  constructor(make, speed) {
    this.make = make;
    this.speed = speed;
  }

  accelerate() {
    this.speed += 10;
    console.log(`Speed after acceleration is ${this.speed}km/h`);
  }

  brake() {
    this.speed -= 5;
    console.log(`Speed after braking is ${this.speed}km/h`);
  }

  get speedUS() {
    return this.speed / 1.6;
  }

  set speedUS(speed) {
    this.speed = speed * 1.6;
  }
}
