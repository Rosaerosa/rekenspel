// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
// Splash Page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown Page
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');
// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');

// Equations
var questionAmount = 0;
var equationsArray = [];
var playerGuessArray = []; // houdt bij op welke knop de gebruiker heeft geklikt 
var bestScoreArray = [];

// Game Page
var firstNumber = 0;
var secondNumber = 0;
var equationObject = {};
const wrongFormat = [];

// Time
var timer;
var timePlayed = 0;
var baseTime = 0;
var penaltyTime = 0;
var finalTime = 0;
var finalTimeDisplay = '0.0';

// Scroll
var valueY = 0; // getal wijzigt als gebruiker op knop klikt en gaat dan 80px omlaag.

// Refresh splashpage best scores
function bestScoresToDOM() {
  bestScores.forEach((bestScore, index) => {
    const bestScoreEl = bestScore;
    bestScoreEl.textContent = `${bestScoreArray[index].bestScore}s`;
  });
}

// Check localstorage for best scores, set bestScoreArray
function getSavedBestScores() {
  if (localStorage.getItem('bestScores')) {
    bestScoreArray = JSON.parse(localStorage.bestScores);
  } else {
    bestScoreArray = [
      { questions: 10, bestScore: finalTimeDisplay },
      { questions: 25, bestScore: finalTimeDisplay },
      { questions: 50, bestScore: finalTimeDisplay },
      { questions: 99, bestScore: finalTimeDisplay },
    ];
    localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
  }
  bestScoresToDOM();
}

// Update bestscore array
function updateBestScore() {
  bestScoreArray.forEach((score, index) => {
    // Select correct Best Score to update
    if (questionAmount == score.questions) {
      // Return Best Score as number with one decimal
      const savedBestScore = Number(bestScoreArray[index].bestScore);
      // Update if the new final score is less or replacing zero
      if (savedBestScore === 0 || savedBestScore > finalTime) {
        bestScoreArray[index].bestScore = finalTimeDisplay;
      }
    }
  });
  // Update Splash Page
  bestScoresToDOM();
  // Save to Local Storage
  localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
}

// Reset game
function playAgain() {
  gamePage.addEventListener('click', startTimer);
  scorePage.hidden = true;
  splashPage.hidden = false;
  equationsArray = [];
  playerGuessArray = [];
  valueY = 0;
  playAgainBtn.hidden = true;
}

// Show scorepage
function showScorePage() {
  // Show Play Again button after 1 second delay
  setTimeout(() => {
    playAgainBtn.hidden = false;
  }, 1000);
  gamePage.hidden = true;
  scorePage.hidden = false;
}

// Format & display time in DOM
function scoresToDOM() {
  finalTimeDisplay = finalTime.toFixed(1);
  baseTime = timePlayed.toFixed(1);
  penaltyTime = penaltyTime.toFixed(1);
  baseTimeEl.textContent = `Tijd: ${baseTime}s`;
  penaltyTimeEl.textContent = `Strafseconden: +${penaltyTime}s`;
  finalTimeEl.textContent = `${finalTimeDisplay}s`;
  updateBestScore();
  // Scroll to Top, go to Score Page
  itemContainer.scrollTo({ top: 0, behavior: 'instant' });
  showScorePage();
}

// Stop timer, process results, go to score-page
function checkTime() {
  console.log(timePlayed);
  if (playerGuessArray.length == questionAmount) {
    clearInterval(timer);
    // Check for wrong guess, add penaltyTime
    equationsArray.forEach((equation, index) => {
      if (equation.evaluated === playerGuessArray[index]) {
        // Correct Guess, No Penalty
      } else {
        // Incorrect Guess, Add Penalty
        penaltyTime += 0.5;
      }
    });
    finalTime = timePlayed + penaltyTime;
    console.log('time:', timePlayed, 'penalty:', penaltyTime, 'final:', finalTime);
    scoresToDOM();
  }
}

// Add a tenth of a second to timePlayed
function addTime() {
  timePlayed += 0.1;
  checkTime();
}

// Start timer when game-page is clicked
function startTimer() {
  // Reset times
  timePlayed = 0;
  penaltyTime = 0;
  finalTime = 0;
  timer = setInterval(addTime, 100);
  gamePage.removeEventListener('click', startTimer); // je wilt maar 1x de tijd opnieuw laten beginnen
}

// Scroll, store userselection in playerGuessArray
function select(guessedTrue) {
  // Scroll 80 more pixels
  valueY += 80;
  itemContainer.scroll(0, valueY);
  // Add player guess to array
  return guessedTrue ? playerGuessArray.push('true') : playerGuessArray.push('false');
}

// Display game-page
function showGamePage() {
  gamePage.hidden = false;
  countdownPage.hidden = true;
}

// Get random number up to a max number
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomInt(questionAmount);
  console.log('correct equations:', correctEquations);
  // Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations;
  console.log('wrong equations:', wrongEquations);
  // Loop through for each correct equation, multiply random numbers up to 9, push to array
  for (var i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: 'true' };
    equationsArray.push(equationObject);
  }
  // Loop through for each wrong equation, mess with the equation results, push to array
  for (var i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomInt(2);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: 'false' };
    equationsArray.push(equationObject);
  }
  shuffle(equationsArray);
}

// Add equations to DOM
function equationsToDOM() {
  equationsArray.forEach((equation) => {
    // Item
    const item = document.createElement('div');
    item.classList.add('item');
    // Equation Text
    const equationText = document.createElement('h1');
    equationText.textContent = equation.value;
    // Append
    item.appendChild(equationText);
    itemContainer.appendChild(item);
  });
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = '';
  // Spacer
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');
  // Selected Item
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations();
  equationsToDOM();

  // Set Blank Space Below
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  itemContainer.appendChild(bottomSpacer);
}

// Displays 3, 2, 1, GO!
function countdownStart() {
  countdown.textContent = '3';
  setTimeout(() => {
    countdown.textContent = '2';
  }, 1000);
  setTimeout(() => {
    countdown.textContent = '1';
  }, 2000);
  setTimeout(() => {
    countdown.textContent = 'START!';
  }, 3000);
}

// Navigate from splashpage to countdownpage to game-page
function showCountdown() {
  countdownPage.hidden = false;
  splashPage.hidden = true;
  countdownStart();
  populateGamePage();
  setTimeout(showGamePage, 4000);
}

// Get the value from selected radiobutton
function getRadioValue() {
  var radioValue;
  radioInputs.forEach((radioInput) => {
    if (radioInput.checked) {
      radioValue = radioInput.value;
    }
  });
  return radioValue;
}

// Form that decides amount of questions
function selectQuestionAmount(e) {
  e.preventDefault();
  questionAmount = getRadioValue();
  console.log('question amount:', questionAmount);
  if (questionAmount) {
      showCountdown();
  }
}

// Switch selected input styling
startForm.addEventListener('click', () => {
  radioContainers.forEach((radioEl) => {
    // Remove Selected Label Styling
    radioEl.classList.remove('selected-label');
    // Add it back if radio input is checked
    if (radioEl.children[1].checked) {
      radioEl.classList.add('selected-label');
    }
  });
});


// Event listeners
gamePage.addEventListener('click', startTimer);
startForm.addEventListener('submit', selectQuestionAmount);

// On load
getSavedBestScores();