const board = document.querySelector('.game-board');
const modeToggle = document.querySelector('.mode-toggle');
const levelSelect = document.getElementById('level');
const startBtn = document.querySelector('.start-btn');
const pointsDisplay = document.querySelector('.points');

const emojiSets = {
  easy: ['🍎', '🍌', '🍇', '🍓'],
  medium: ['🍎', '🍌', '🍇', '🍓', '🍒', '🥝'],
  hard: ['🍎', '🍌', '🍇', '🍓', '🍒', '🥝', '🍑', '🍉'],
  superhard: ['🍎', '🍌', '🍇', '🍓', '🍒', '🥝', '🍑', '🍉', '🍍', '🥥', '🍋', '🍈', '🍏', '🥭']
};

const gifts = {
  easy: [
    "🏅 You earned the Gold Starter Badge!",
    "✨ Beginner Star! Keep shining!",
    "🌱 Grow More! Keep Learning!"
  ],
  medium: [
    "🥇 Champion Badge unlocked!",
    "💡 Smart Thinker Award!",
    "🔑 Secret Clue Finder!"
  ],
  hard: [
    "🧠 Memory Pro Badge!",
    "🚀 Level Up Genius!",
    "🔥 Mind Master Title!"
  ],
  superhard: [
    "👑 Ultimate Memory Legend!",
    "🦾 Brain Warrior Award!",
    "🏆 The Unbeatable!"
  ]
};

let cards = [];
let flippedCards = [];
let lockBoard = false;
let totalPoints = 0;
let firstTry = true;
let currentLevel = '';

startBtn.onclick = function() {
  const level = levelSelect.value;

  let average = 0;
  if (level === 'easy') average = 16;
  if (level === 'medium') average = 24;
  if (level === 'hard') average = 32;
  if (level === 'superhard') average = 50;

  alert(`🎁 If you want a gift, your points must be greater than ${average}!`);
startGame();
};


  modeToggle.onclick = function() {
  document.body.classList.toggle('dark');
};

function startGame() {
  board.innerHTML = '';
  pointsDisplay.textContent = '0';
  totalPoints = 0;
  firstTry = true;
  currentLevel = levelSelect.value;

  const emojis = emojiSets[currentLevel];
  cards = emojis.concat(emojis);
  cards.sort(() => 0.5 - Math.random());

  cards.forEach(emoji => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.emoji = emoji;
    card.textContent = '';
    board.appendChild(card);
  });

  flippedCards = [];
  lockBoard = false;
 board.addEventListener('click', flipCard);
}

function flipCard(e) {
  const clicked = e.target;
  if (!clicked.classList.contains('card') || clicked.classList.contains('flipped') || lockBoard) {
    return;
  }

  clicked.textContent = clicked.dataset.emoji;
  clicked.classList.add('flipped');
  flippedCards.push(clicked);

  if (flippedCards.length === 2) {
    lockBoard = true;

    const match = flippedCards[0].dataset.emoji === flippedCards[1].dataset.emoji;
    if (match) {
      if (firstTry) {
        totalPoints += 5;
      } else {
        totalPoints += 3;
      }
      pointsDisplay.textContent = totalPoints;
      flippedCards = [];
      lockBoard = false;

      const allFlipped = document.querySelectorAll('.card.flipped').length;
      if (allFlipped === cards.length) {
        setTimeout(() => {
          alert('Game Over! Your total points: ' + totalPoints);

          if (currentLevel === 'easy' && totalPoints > 15) {
            showGiftBoxes('easy');
          }
          if (currentLevel === 'medium' && totalPoints > 24) {
            showGiftBoxes('medium');
          }
          if (currentLevel === 'hard' && totalPoints > 32) {
            showGiftBoxes('hard');
          }
          if (currentLevel === 'superhard' && totalPoints > 50) {
            showGiftBoxes('superhard');
          }

        }, 300);
      }

      firstTry = true; 

    } else {
      firstTry = false;
      setTimeout(() => {
        flippedCards.forEach(card => {
          card.textContent = '';
          card.classList.remove('flipped');
        });
        flippedCards = [];
        lockBoard = false;
      }, 1000);
    }
  }
}

function showGiftBoxes(level) {
  const giftArea = document.createElement('div');
  giftArea.className = 'gift-area';
  giftArea.innerHTML = `
    <h3>🎁 Choose your reward:</h3>
    <div class="gift-boxes">
      <div class="gift-box">🎁</div>
      <div class="gift-box">🎁</div>
      <div class="gift-box">🎁</div>
    </div>
  `;
  document.body.appendChild(giftArea);

  const boxes = giftArea.querySelectorAll('.gift-box');
  boxes.forEach(box => {
    box.onclick = function() {
      const giftList = gifts[level];
      const randomGift = giftList[Math.floor(Math.random() * giftList.length)];
      alert(`You got: ${randomGift}`);
      giftArea.remove();
    };
  });
}
