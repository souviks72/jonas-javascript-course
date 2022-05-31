'use strict';
console.log('-----------I N H E R I T A N C E-----------------');
/*
---> See the diagram for this lecture: Inheritance between classes
Inheritance using traditional constructor functions and Object.create()

We have two constructor functions: Person and Student and Student inherits from Person.
How to inherit in traditonal Contructor function way:
1. Inside Student call Person(), however value of "this" will be lost inside Person(), so use call/bind.
   The value is lost because the Person constructor is called without the "new" keyword, and without this 
   keyword the value of "this" is undefined.
2. Manually we need to link Student.prototype to Person.prototype using Object.create. This will enable us
   to use Person's functions and attributes using the prototype chain
*/
const Person = function (name, birthYear) {
  this.name = name;
  this.birthYear = birthYear;
};

Person.prototype.calcAge = function () {
  console.log(2022 - this.birthYear);
};

const Student = function (name, birthYear, course) {
  Person.call(this, name, birthYear);
  this.course = course;
};

Student.prototype = Object.create(Person.prototype);
Student.prototype.constructor = Student; //because of the above line, Student objects prototype directly
//got linked to Person, we need to fix that
/*
It is important to link this here, before anything is attached to the Student prototype because
Object.create() will override anything in Student.prototype and return an empty object
*/

/*
Also, this wont work: Student.prototype = Person.prototype;
The above statement will not create Student.prototype, instead it will link the student objects
directly to the Person.prototype and we wont have a proper prototype chain;see lecture diagram
*/

Student.prototype.introduce = function () {
  console.log(`My name is ${this.name} and I study ${this.course}`);
};

console.log('------------CODING CHALLENGE 3-------------------');
const Car = function (make, speed) {
  this.make = make;
  this.speed = speed;
};

Car.prototype.accelerate = function () {
  this.speed += 10;
  console.log(`Speed after acceleration is ${this.speed}.`);
};

Car.prototype.brake = function () {
  this.speed -= 10;
  console.log(`Speed after braking is ${this.speed}.`);
};

const EV = function (make, speed, charge) {
  Car.call(this, make, speed);
  this.charge = charge;
};

EV.prototype = Object.create(Car.prototype);
console.log(EV);

EV.prototype.accelerate = function () {
  this.charge -= 5;
  this.speed += 10;
  console.log(
    `Speed after acceleration is ${this.speed}. Charge reduced to ${this.charge}`
  );
};

EV.prototype.brake = function () {
  this.charge += 1;
  this.speed -= 5;
  console.log(
    `Speed after braking is ${this.speed}. Charge increased to ${this.charge}`
  );
};

EV.prototype.chargeBattery = function () {
  this.charge += 10;
  if (this.charge > 90) {
    this.charge -= this.charge - 90;
  }
};

let tesla = new EV('Tesla', 200, 80);
tesla.accelerate();

console.log('----------INHERITANCE OF CLASSES-------');

class Person2 {
  constructor(name, birthYear) {
    this.name = name;
    this.birthYear = birthYear;
  }

  set fullName(name) {
    if (name.indexOf(' ') > 0) this._fullname = name;
    else alert(`${fullname} is not a full name`);
  }

  get fullName() {
    return this._fullname;
  }

  static sayHi() {
    console.log(`Hi, I am a ${this.name}`);
  }
}

class Student2 extends Person2 {
  constructor(name, birthYear, course) {
    super(name, birthYear);
    this.course = course;
  }

  //In static function "this" will refer to the Class itself
  static sayHi() {
    console.log(`Yo I am a${this.name}`);
  }
}

let st1 = new Student('Ryan', 1999, 'MBA');

console.log('------------A C C E S S    M O D I F I E R S--------------');

class Account {
  constructor(owner, currency, pin) {
    this.owner = owner;
    this.currency = currency;
    this.pin = pin;
    this.movements = [];
  }

  //public interface
  deposit(val) {
    this.movements.push(val);
    return this; //for mthod chaining
  }

  withdraw(val) {
    //Abstracts withdraw; public interface will not need to do -ve push into movements
    this.deposit(-val);
    return this; //for mthod chaining
  }

  //this should be private;if a logic like this accessed outside, it will cause havoc
  approveLoan(val) {
    // "inserts some bank logic to approve/deny loan"
    return true; //for mthod chaining
  }

  requestLoan(val) {
    if (this.approveLoan(val)) {
      this.deposit(val);
      console.log(`Loan Approved`);
    }
    return this; //for mthod chaining
  }
}

const acc1 = new Account('Jona', 'EUR', 1234);

//acc1.movements.push(200)
acc1.deposit(200);
//acc1.movements.push(-120)
acc1.withdraw(120);
acc1.requestLoan(100000);
acc1.approveLoan(100000); //this will cause havoc if not private

console.log(acc1);
console.log(acc1.pin); //pin gets exposed

//Method chaining
acc1.deposit(300).deposit(500).withdraw(35).requestLoan(10000).withdraw(40);
//to use method chaing, return "this" in every method, that does not return
//anything, basically those methods that set some value

/*
Conventionally, we can have protected fields/methods starting with "_"
and devs will treat it as such, eg: this._movements, this_approveLoan
This is not truly private though
*/

/*
There is a new concept of class fields --> public and private. These fields will
be on the "INSTANCE" and NOT ON THE "PROTOTYPE". Private fields/methods will
start with "#", eg: #movements, #approveLoan
*/
class Account2 {
  //public fields
  locale = navigator.language;

  //private field
  #movements = [];
  #pin;
  constructor(owner, currency, pin) {
    this.owner = owner;
    this.currency = currency;
    this.#pin = pin;
    //this.movements = [];
  }

  #approveLoan(val) {
    return true;
  }

  requestLoan(val) {
    if (this.#approveLoan(val)) this.#movements.push(val);
    console.log(`Loan approved`);
  }

  getMovements() {
    return this.#movements;
  }
}

const acc2 = new Account2('Jona', 'EUR', 1234);
acc2.requestLoan(9999999);
console.log(acc2.getMovements());
