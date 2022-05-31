'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = '';

  let movArr = account.movements;
  if (sort === true) {
    // arr.slice() returns a deep copy of the array, we dont want to sort the
    //actual array(sort() will modify the original array)
    movArr = account.movements.slice().sort((a, b) => a - b);
  }

  movArr.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov} €</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${account.balance} €`;
};

const calcDisplaySummary = function (account) {
  const totalDeposit = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumIn.textContent = `${totalDeposit} €`;

  const totalWithdrawal = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumOut.textContent = `${Math.abs(totalWithdrawal)} €`;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(intrst => intrst >= 1)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumInterest.textContent = `${interest} €`;
};

const createUsernames = function (accounts) {
  accounts.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (account) {
  //display movements
  displayMovements(account);
  //display balance
  calcDisplayBalance(account);
  //display summary
  calcDisplaySummary(account);
};

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin == inputLoginPin.value) {
    //show welcome msg
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.username.split(' ')[0]
    }`;
    //display ui
    containerApp.style.opacity = 100;
    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    //lose focus from input fields
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  let transferAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  let amt = Number(inputTransferAmount.value);
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amt > 0 &&
    transferAccount &&
    currentAccount.balance >= amt &&
    transferAccount.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amt);
    transferAccount.movements.push(amt);
    updateUI(currentAccount);
    console.log(accounts);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    let i = accounts.findIndex(
      acc => acc.username === inputCloseUsername.value
    );
    accounts.splice(i, 1);
    containerApp.style.opacity = 0;
    console.log(accounts);
  }
  inputClosePin.value = inputCloseUsername.value = '';
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
});

let isSorted = false;
btnSort.addEventListener('click', function () {
  displayMovements(currentAccount, !isSorted);
  isSorted = !isSorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const eurToUsd = 1.1;
const movementsUDS = movements.map(mov => mov * eurToUsd);
console.log(movementsUDS);

const deposits = movements.filter(mov => mov > 0);
console.log(deposits);
const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals);

let initialAccumulatorValue = 0;
const balance = movements.reduce(function (accumulator, currentEl, i, arr) {
  return accumulator + currentEl;
}, initialAccumulatorValue);
console.log(balance);

const maximum = movements.reduce(
  (acc, curr) => (curr > acc ? curr : acc),
  movements[0]
);
console.log(maximum);

const isDeposit = x => x > 0;
console.log(movements.some(isDeposit));
console.log(movements.every(isDeposit));
console.log(movements.includes(34));

//flat --> goes one level deep
const arx = [[1, 2, 3], 4, 5];
const arxDeep = [[[1, 2], 3, 4], [5, 6], 7];
console.log(arx.flat());
console.log(arxDeep.flat());

//Using flat and map together we can flatten the accounts array to get all account movements in one array to sum
//flat(depth) --> depth of level upto which flattening is to be done
const bankTotalMoney = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, curr) => acc + curr, 0);

const bankTotalMoney2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, curr) => acc + curr, 0);
//using flatMap() we can do map and flat at the same time, improving performance
/////////////////////////////////////////////////
