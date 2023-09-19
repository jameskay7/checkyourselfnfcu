const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressBarFull = document.getElementById("progress-bar-full");
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0
let availableQuestions = [];
let correctSound = new Audio('correctSound.mp3');
let incorrectSound = new Audio('incorrectSound.mp3');
const loader = document.getElementById('loader');
const game = document.getElementById('game');
const progressTxt = document.getElementById('progressTxt');
const scoreTxt = document.getElementById('score');


let questions = [];

fetch("questions.json")
  .then(res => {
    return res.json();
   })
    .then(loadedQuestions => {
        console.log(loadedQuestions);
        questions = loadedQuestions;
        startGame();
    })
    .catch(err => {
        console.log(err);
    });




//constant variables

const correct_points = 10;
const max_questions = 16;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
};

getNewQuestion = () => {
    if (availableQuestions.length === 0 || questionCounter >= max_questions){
        localStorage.setItem('mostRecentScore', score);
        return window.location.assign("/end.html");
    }
    questionCounter++;
    progressTxt.innerText = `Question ${questionCounter}/${max_questions}`;
    //updating progress bar
    progressBarFull.style.width = `${(questionCounter / max_questions) * 100}%`;



    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach(choice => {
        const number = choice.dataset["number"];
        choice.innerText = currentQuestion["choice" + number];
    });

    availableQuestions.splice(questionIndex, 1);
    console.log(availableQuestions);
    acceptingAnswers = true;
};

choices.forEach(choice => {
    choice.addEventListener("click", e => {
        if (!acceptingAnswers) return;
        
        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];

        const classToApply = 
            selectedAnswer == currentQuestion.answer ? "correct"
            : "incorrect";

            if (classToApply == 'correct'){
                incrementScore(correct_points);
            }

        selectedChoice.parentElement.classList.add(classToApply);

        
        function playSound(){
            return selectedAnswer == currentQuestion.answer ? correctSound.play() :
            incorrectSound.play();
        }
        playSound();
        

        setTimeout( () => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();

        }, 1000);
        
    });
});


incrementScore = num => {
    score += num;
    scoreTxt.innerText = score;
};


