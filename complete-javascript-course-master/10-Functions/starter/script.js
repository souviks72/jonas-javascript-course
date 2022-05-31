'use strict';

const poll = {
  question: 'What is your favourite programming language?',
  options: ['0: Javascript', '1: Python', '2: Rust', '3: C++'],
  answers: new Array(4).fill(0),

  registerAnswer() {
    let ans = Number(
      prompt(
        'What is your favourite programming language?\n0: JavaScript\n1: Python\n 2: Rust\n3: C++\n(Write option number)'
      )
    );

    if (ans % 1 !== 0 || ans > 3) {
      console.log('Invalid input');
    } else {
      this.answers[ans]++;
      console.log(this.answers);
    }

    this.displayResults();
  },

  displayResults() {
    let inp = prompt("Enter type of answer you want: 'array' or 'string'");
    console.log(inp);
    if (inp !== 'array' && inp !== 'string') {
      console.log('Invalid input');
    } else if (inp === 'array') {
      console.log(poll.answers);
    } else if (inp === 'string') {
      console.log(`The answers are ${poll.answers.join(', ')}`);
    }
  },
};

document.querySelector('.poll').addEventListener('click', function () {
  poll.registerAnswer();
});
