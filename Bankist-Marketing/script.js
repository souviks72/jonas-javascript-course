'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const nav = document.querySelector('.nav');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//--------------SMOOTH SCROLLING----------------------

btnScrollTo.addEventListener('click', function (e) {
  //get coordinates of target. This returns top.right,left,bottom(rel to viewport), width and a few other properties
  const s1coords = section1.getBoundingClientRect();

  //to get absolute values of x and y
  console.log(window.pageXOffset, window.pageYOffset);
  console.log(s1coords.left, s1coords.right);

  //Height and width of viewport
  console.log(
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  //scrolling function, old school
  /* The left & right from the getBoundingClientRect() gives the distance of the element from 
  current viewport top,left(0,0). So if we scroll down a bit, left and right values decrease. But
  the window.scrollTo() takes absolute x,y from top of document.So we need to add the pageX,YOffsets which
  represent how far we hav scrolled from the top of the document
  SO: current viewport to section distance + document top to viewport top distance -->  s1coords.top + window.pageYOffset
  */
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  //making it smooth
  window.scrollTo({
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior: 'smooth',
  });

  //MODERN METHOD, ONLY SUPPORTED BY MODERN BROWSERS
  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////TABBED  COMPONENT/////////////////////////////////

tabsContainer.addEventListener('click', function (e) {
  //we need to listen for clicks on the button. But we are use event delegation to parent because we dont want to
  //attach a copy of the same function to each button. But why use .closest('class_of_btn')? Because the button
  //element has a span inside it and the user can click on the button or on the span in it. So we use .closest() with
  //the class of the btn as our matching criteria
  const clicked = e.target.closest('.operations__tab');
  console.log(clicked);
  //Guard clause: event listener is on the parent container of the buttons. User can click outside the buttons in the
  //blank space of the parent as well. In that case, the variable clicked above will be null as nothing will match
  //In that case we should return
  if (!clicked) return;

  //Active tab
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  //Activate the content area
  //There is a dataset attribute on the buttons data-tab=<number> and a corresponding
  //operations__content--<number> o each content element. We extract the number from the button clicked
  //and dynamically activate that tab content element
  tabsContent.forEach(t => t.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});
/////////////////MENU FADE ANIMATION ---> PASSING PARAMS INTO EVENT HANDLER CALLBACK/////////////////////////
const handleHover = function (e) {
  const link = e.target;
  //selecting all siblings,including itself by going to closest parent(nav) and slecting all nav__link inside
  const siblings = link.closest('.nav').querySelectorAll('.nav__link');
  //selecting the logo(img) inside navbar
  const logo = link.closest('.nav').querySelector('img');
  siblings.forEach(el => {
    // the value of "this" will be passed by using bind call apply.
    //We can pass only one arg to an eventHandler callback, by using "this"
    //to pass multiple values, pass an obj or array via this
    if (el !== link) el.style.opacity = this;
  });
  logo.style.opacity = this;
};
//mouseover and mouseenter are same events, except mouseenter does not bubble
nav.addEventListener('mouseover', handleHover.bind(0.5));

//opposite of mouseout to reverse the animation back to original state
nav.addEventListener('mouseout', handleHover.bind(1));

//////////////////////STICKY NAVIGATION/////////////////////////////////
//scroll event is on window, not document
//it is inefficient as it is fired every time we scroll,even slightly
//select top of section-1, and when we scroll to top of section--1, start sticky nav
const initialCoords = section1.getBoundingClientRect();
window.addEventListener('scroll', function (e) {
  if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
});

//-----> Using Observer API
// Observer API observes when a target element intesects another element or the viewport

//entries is a list of events being fired on every scroll. It has some usefule keys/info
//like isIntersection, percentage,isVisible,etc
/*
const obsCallback = function (entries, observer) {
  entries.forEach(entry => console.log(entry));
};

//root is the element our target is intercepting, null refers to view port
//threshold(0.1=10%) --> percentage of intersection at which the observer callback will be called
const obsOptions = {
  root: null,
  threshold: [0, 0.2], //we can observe for multiple percentages of intersection
};

const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(section1);
*/

//We will make the nav sticy when header is almost out of view, almost? -->when the gap between header
//and section--1 is the height of the nav
const headr = document.querySelector('.header');
const navbarHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navbarHeight}px`,
});
//rootMargin adds an imaginary margin(always in px) to the target element. In this case, height of navbar is 90px
//rootMargin:-90px reduces header height by 90px,so when distance between header and section--1 is 90px, the observer
//callback is called
headerObserver.observe(headr);

////// ---> Another Use of ObserverAPI, revelaing content(here sections) as we scroll close to them
const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const revealSectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

const sections = document.querySelectorAll('section');
sections.forEach(section => {
  revealSectionObserver.observe(section);
  //section.classList.add('section--hidden');
});
//////////// ------> LAZY LOADING IMAGES WITH OBSERVER API-----------
/*
We have some images with a custom "data-src" attribute that contains the path to the actual high resolution images
Meanwhile the image src being used in these images a very small image and that is also blurred with css. When we intersect 
these images, we need to put the path in "data-src" into img[src] and un blurr it
*/
const imgTargets = document.querySelectorAll('img[data-src]');

const lazyLoadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  //once the img[src] has been changed, browser will emmit the load event
  //it is best to remove the blur effect after img load only because otherwise
  //low res img will be unblurred, then slowly that will get replaced by the high-res
  //img, this makes the site look bad
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const lazyLoadImgObserver = new IntersectionObserver(lazyLoadImg, {
  root: null,
  threshold: 0.1,
  rootMargin: '200px',
});

imgTargets.forEach(target => lazyLoadImgObserver.observe(target));

///////////////////SLIDER\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotsContainer = document.querySelector('.dots');

let currentSlide = 0;
const maxSlide = slides.length;
//const slider = document.querySelector('.slider');

const createDots = function () {
  slides.forEach((_, i) => {
    dotsContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

const activateDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};

const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};

const nextSlide = function () {
  if (currentSlide == maxSlide - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }

  goToSlide(currentSlide);
  activateDot(currentSlide);
};

const prevSlide = function () {
  if (currentSlide === 0) {
    currentSlide = maxSlide - 1;
  } else {
    currentSlide--;
  }
  goToSlide(currentSlide);
  activateDot(currentSlide);
};

const initSlider = function () {
  goToSlide(0);
  createDots();
  activateDot(0);
};
initSlider();

//NEXT SLIDE
btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') prevSlide();
  e.key === 'ArrowRight' && nextSlide();
});

dotsContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset;
    goToSlide(slide);
  }
});
//
//
//
//
//
//
//
//
//

///////////////////SELECTING ELEMENTS////////////////////////////////
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const header = document.querySelector('.header');
//returns a NodeList
const allSections = document.querySelectorAll('.section');

document.getElementById('section--1');
//returns a HTMLCollection -- this list is live and if we delete an element (say a button) after creation of this list, it will be
//automatically removed from this list as well
const allButtons = document.getElementsByTagName('button');
document.getElementsByClassName('btn');

////////////////////CREATING AND INSERTING ELEMENTS///////////////////////////////
//.insertAdjacentHTML (see original Bankist for example)
const message = document.createElement('div'); // this element is not in the DOM yet
message.classList.add('cookie-message');
//message.textContent = 'We use cookies for improved functionality and analytics';
message.innerHTML =
  'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

//prepend adds to the start of the HTMLCollection, append to the end
//However we see only one message element in the website because prepend had already inserted it into the list
// and append saw it was already there, so it moved it to the end.
//header.prepend(message);
header.append(message);
//To insert multiple times we need copies. true in cloneNode means children will be copied as well
//header.append(message.cloneNode(true));

//append and prepend will insert as child elements of parent
//before and after will insert as sibling elements
// header.before(message);
// header.after(message);

//DELETE ELEMENTS
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove(); //this is new, earlier we had to go up to parent element and then delete the child like below:
    //message.parentElement.removeChild(message);
  });

// STYLES-----------
//These styles are set as INLINE property
message.style.backgroundColor = '#37383d';
message.style.width = '120%';
// We can extract these properties that we set as: message.style.backgroundColor
//However we cannot get the styles set by css classes,etc. We can get all the styles applied together
//using getComputedStyle(message).<property-we-want> like:
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 40 + 'px';
//we need to do parseFloat(height,base10) because height will be in px and parseFloat will get us the number

//In css file we have some variable under :root. These are properties set on the document element
// to be used like variables
document.documentElement.style.setProperty('--color-primary', 'orangered');

//ATTRIBUTES------------------------
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
//set standard attributes
logo.alt = 'New alt text';
console.log(logo.src); //this will print the absolute src of image
console.log(logo.getAttribute, 'src'); //this will print the relative src in the html file
//if we set a property that is not standard on the element, then we wont be able to extract it like this
//we need to uset getAttribute(key) and setAttribute(key,value)
//NON STANDARD
console.log(logo.designer); //wont work as designer is a property we created ourself
console.log(logo.getAttribute('designer'));
logo.setAttribute('company', 'Bankist');

//extracting custom dataattributes(data-name-kebabcase)
//data attributes always start with "data-"" and is in kebab case
//to etract that we do element.dataset.nameInCamelCase
console.log(logo.dataset.versionNumber);

// CLASSES
logo.classList.add('classname1', 'classname2');
logo.classList.remove('classname1', 'classname2');
logo.classList.toggle('classname');
logo.classList.contains('classname1');

//Dont use this, it overwrites all other class names
logo.className = 'classname';
//
//
//
//
//
//-------------EVENT HANDLING--------------------------
const h1 = document.querySelector('h1');

const mouseEnterH1Once = function (e) {
  console.log('----------MOUSE ENTERED AN H1');
  //doing this here will mean the event listener will fire once only
  //we can also remove it outside
  h1.removeEventListener('mouseenter', mouseEnterH1Once);
};

h1.addEventListener('mouseenter', mouseEnterH1Once);

//another way is to directly add eventlistener, not recommended
h1.onmousenter = function (e) {
  console.log('-------on mouse enter');
};
// Always use addEventListener because : i) it can be removed
// ii) we can add mutiple event listeners on the same event, if we do it in the second way,
// it gets overridden and only last event listener is used

//----------------DOM TRAVERSING-----------------------

//Going downwards: selecting children
console.log(h1.querySelectorAll('.highlight'));
// this will select ALL elements with the class "highlight" INSIDE h1,
//no matter how deeply nested it is. However it wont select any other elements
//with the same class that are NOT INSIDE h1
console.log(h1.childNodes);
// this returns a LIVE nodelist of all children
console.log(h1.children);
//It includes all direct children only, LIVE HTMLCollection, only elements
h1.firstElementChild.style.color = 'blue';
h1.lastElementChild.style.color = 'red';

//Going upwards: PARENTS

//Direct parents
console.log(h1.parentNode);
console.log(h1.parentElement);

//closest selects the nearest parent matching the query in the (). It the opposite of querySelector, which
//searches for nearest child, while closest searches for nearest parent
//h1.closest('.header').style.background = 'var(--gradient-secondary)';

//GOING SIDEWAYS: SIBLINGS
// ----> In Js we can only select previous and next sibling
console.log(h1.nextElementSibling);
console.log(h1.previousElementSibling);
console.log(h1.previousSibling);
console.log(h1.nextSibling);
//Selecting all siblings, including itself
console.log(h1.parentElement.children);
//this is an iterable not an array, so convert to array by spreading
[...h1.parentElement.children].forEach(function (el) {
  if (el != h1) el.style.transform = 'scale(0.9)';
});
