'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

btn.style.margin = '20px';

///////////////////////////////////////

// const getCountry = function (country) {
//   const request = new XMLHttpRequest();
//   request.open('GET', `https://restcountries.com/v2/name/${country}`);
//   request.send();

//   request.addEventListener('load', function () {
//     const [data] = JSON.parse(this.responseText);
//     console.log(data);
//     const html = `
//         <article class="country">
//           <img class="country__img" src="${data.flag}" />
//           <div class="country__data">
//               <h3 class="country__name">${data.name}</h3>
//               <h4 class="country__region">${data.region}</h4>
//               <p class="country__row"><span>👫</span>${(
//                 +data.population / 1000000
//               ).toFixed(1)}M people</p>
//               <p class="country__row"><span>🗣️</span>${
//                 data.languages[0].name
//               }</p>
//               <p class="country__row"><span>💰</span>${
//                 data.currencies[0].name
//               }</p>
//           </div>
//           </article>
//           `;

//     countriesContainer.insertAdjacentHTML('beforeend', html);
//     countriesContainer.style.opacity = 1;
//   });
// };

const renderCountry = function (data, className = 'country') {
  const html = `
  <article class=${className}>
    <img class="country__img" src="${data.flag}" />
    <div class="country__data">
      <h3 class="country__name">${data.name}</h3>
      <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>${(
          +data.population / 1000000
        ).toFixed(1)}M people</p>
        <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
        <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
    </div>
  </article>
          `;

  countriesContainer.insertAdjacentHTML('beforeend', html);
};

// fetch returns promise, use "then" to process it
const getCountry = function (country) {
  fetch(`https://restcountries.com/v2/name/${country}`)
    .then(response => {
      if (!response.ok) {
        console.log('errrrr');
        throw new Error(`Country not found (${response.status})`);
      }

      return response.json();
    })
    .then(data => {
      console.log(data[0]);
      renderCountry(data[0]);
      const neighbour = data[0].borders?.[0];

      //country 2 --> chaining promises
      //returning anything from "then" returns a promise to chain promise
      return fetch(`https://restcountries.com/v2/alpha/${neighbour}`);
    })
    .then(resp => resp.json())
    .then(data => renderCountry(data, 'neighbour'))
    .catch(err => renderError(err))
    .finally(() => (countriesContainer.style.opacity = 1)); //finally runs always, at the end, after then/catch
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentHTML('beforeend', `${msg}`);
};

btn.addEventListener('click', function () {
  getCountry('portugal');
});

//Promisifying geolocation API
const getPosition = function () {
  return new Promise(function (resolve, reject) {
    // navigator.geolocation.getCurrentPosition(
    //   pos => resolve(pos),
    //   err => reject(err)
    // );
    navigator.geolocation.getCurrentPosition(resolve, reject); //postion and error are automatically passed to resolve/reject
  });
};

//showMyCountry();

//A Simple promise
/*
A promise takes a function as a param which is an executer function. The executer function
takes in two params, resolve and reject. Depending on success and failure we call resolve
and reject respectively with certain values. The value passed to "resolve" is accessed via "then"
and the value passed via "reject" is accessed through catch
*/

const lotteryPromise = new Promise(function (resolve, reject) {
  //console.log('Lottery Draw is happening......');
  setTimeout(function () {
    if (Math.random() >= 0.5) {
      resolve('Money Money Money');
    } else {
      reject(new Error('Paisa barbaddd benc**d!!'));
    }
  }, 1000);
});

lotteryPromise.then(res => console.log(res)).catch(err => console.log(err));

//Promisifying callback structured setTimeout
const wait = function (seconds) {
  //return new promise with no value in resolve; and no reject
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
};

wait(1)
  .then(() => {
    //console.log('1 seconds');
    return wait(2);
  })
  .then(() => {
    //console.log('2 seconds have passed');
  });

//Immediately resolving/rejecting a promise
Promise.resolve('Some val').then(v => console.log(v));
Promise.reject('Some val').catch(err => console.log(err));

//---------------------ASYNC AWAIT-----------------------------
console.log('-------Async----------');
/*
Functions which have the "async" keyword are executed asynchronously.
Commands that return a promise are written after "await". The execution will
stop here and wait for the promise to resolve, and store it in a variable.
However this does not stop the main thread of execution because "await" can
only be used inside "async" function which are not executed on the main thread
Remember:- the value returned by async functions will ALWAYS BE A PROMISE
This can be consumed with "then" calls. A new way is to consume them
in another async function using IIFE----
*/
const whereAmI = async function (country) {
  //await RESOLVES a promise and returns the value
  //await calls must be wrapped in try catch always*************
  try {
    let res = await fetch(`https://restcountries.com/v2/name/${country}`);
    res = await res.json();
    return res;
  } catch (err) {
    return err;
  }
};

(async function () {
  try {
    let res = await whereAmI('portugal');
    console.log(res);
  } catch (err) {
    console.log(`whereAmI consumption err: ${err}`);
  }
})();

//CONSUMING MULTIPLE PROMISES AT THE SAME TIME
/*
Promise.all() allows us to consume multiple promises simultanously.
If we had to use await to fetch them individually then i would have become
synchronous code and the three countrys' data would have loaded one after another
Instead now they will load in parallel. However, Promise.all() will return error
if any one of the calls fail

Promise.race(), same syntax, will return only the first promise that succeeds or fails
Promise.any() will return the first one to succeed, even if one has alreaddy 
failed first, unless all fails.

Promise.allSettled is same as "all()", except it returns only successful promises



and will not fail if a single promise fails
*/
const whereAmI2 = async function (c1, c2, c3) {
  try {
    const data = await Promise.all([
      getJson(`https://restcountries.com/v2/name/${c1}`),
      getJson(`https://restcountries.com/v2/name/${c2}`),
      getJson(`https://restcountries.com/v2/name/${c3}`),
    ]);

    console.log(data.map(d => d[0].capital));
  } catch (err) {
    console.log(err);
  }
};

const getJson = async function (url) {
  try {
    let data = await fetch(url);
    return await data.json();
  } catch (err) {
    return err;
  }
};

whereAmI2('sweden', 'finland', 'norway');
