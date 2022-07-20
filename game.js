// variables
const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull =document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game')

//decalarations
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

fetch('https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple')
.then(res => {
  return res.json();
})
.then(loadedQuestions => {
  console.log(loadedQuestions.results);
  questions = loadedQuestions.results.map(loadedQuestion => {
    const formattedQuestion = {
      question: loadedQuestion.question
    };
    const answerchoices = [...loadedQuestion.incorrect_answers];
    formattedQuestion.answer = Math.floor(Math.random() * 3) +1;
    answerchoices.splice(formattedQuestion.answer -1, 0, loadedQuestion.corrrect_answer);

    answerchoices.forEach((choice,index) => {
      formattedQuestion["choice" + (index + 1)] = choice;
    });
    return formattedQuestion;
  });

  startGame();
})

.catch(error => {
  console.log(error);
});

//CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 3;

// StartGame function
startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    console.log(availableQuestions);
    getNewQuestion();
    game.classList.remove("hidden");
    loader.classList.add("hidden");
};

getNewQuestion = () => {

  //goto end page when questions are empty
    if ( availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
      localStorage.setItem('mostRecentScore', score);
        //go to the end page when finishing all questions
        return window.location.assign('/end.html');
    }

    //incrementing the counter
    questionCounter++;
    progressText.innerText = `Question ${questionCounter} / ${MAX_QUESTIONS}`;

    //update the progressbar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) *100}%`;


    //get random question using random operator and convert it into integer
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);

    //reference to current question
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    //now we need to replace the choices with new choices 
    choices.forEach( (choice) => {
        //get a reference to the choice data number 
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number]
    });

    //remove the answered question
    availableQuestions.splice(questionIndex, 1);
    console.log(availableQuestions);
    acceptingAnswers = true;
};

choices.forEach( choice => {
    choice.addEventListener('click' , e => {
        console.log(e.target);
        if(!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];
        //check if selected answer is correct
        console.log(selectedAnswer == currentQuestion.answer);

        const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';
        console.log(classToApply)
       //Updating score 

       if (classToApply === 'correct'){
         incrementScore(CORRECT_BONUS);
       }

        //add style in javascript
        selectedChoice.parentElement.classList.add(classToApply);

        
        //set a timer to wait 
        setTimeout( () => {
            selectedChoice.parentElement.classList.remove(classToApply);
            //after selecting answer you want new question so call the function
        getNewQuestion();

        }, 1000);
        
    });
});

incrementScore = bonus => {
  score += bonus;
  scoreText.innerText = score;
};


