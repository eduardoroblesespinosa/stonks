import * as audio from './audio.js';

const spinButton = document.getElementById('spin-button');
const wheel = document.getElementById('roulette-wheel');
const creditsDisplay = document.getElementById('credits-display');
const tokensDisplay = document.getElementById('tokens-display');
const levelDisplay = document.getElementById('level-display');
const nextLevelDisplay = document.getElementById('next-level-display');
const highscoreDisplay = document.getElementById('highscore-display');
const resultModal = new bootstrap.Modal(document.getElementById('resultModal'));
const resultMessage = document.getElementById('result-message');
const resultDescription = document.getElementById('result-description');
const resultSymbol = document.getElementById('result-symbol');

const purchaseModal = new bootstrap.Modal(document.getElementById('purchaseModal'));
const purchaseMessage = document.getElementById('purchase-message');

const levelUpModal = new bootstrap.Modal(document.getElementById('levelUpModal'));
const levelUpMessage = document.getElementById('level-up-message');
const levelUpReward = document.getElementById('level-up-reward');

const lowCreditsModal = new bootstrap.Modal(document.getElementById('lowCreditsModal'));
const outOfCreditsModal = new bootstrap.Modal(document.getElementById('outOfCreditsModal'));

const SPIN_COST = 20;
const SEGMENT_COUNT = 12;

let state = {
    credits: 100,
    tokens: 0,
    level: 1,
    isSpinning: false,
    levelThresholds: [100, 300, 700, 1500, 3100, 6300, 12700, 25500, 51100], // Tokens for levels 2-10
    highScore: 0,
    lowCreditPromptShown: false // Track if the prompt has been shown
};

// Define the 12 segments of the roulette
const segments = [
    { type: 'prize', value: 10, tokens: 5, symbol: 'symbol-planet.png', message: '¡Planeta de Premios!', description: 'Ganas 10 créditos y 5 tokens.' },
    { type: 'penalty', value: 15, tokens: 0, symbol: 'symbol-asteroid.png', message: '¡Lluvia de Asteroides!', description: 'Pierdes 15 créditos.' },
    { type: 'prize', value: 50, tokens: 25, symbol: 'symbol-galaxy.png', message: '¡Super Galaxia!', description: '¡GRAN PREMIO! 50 créditos y 25 tokens.' },
    { type: 'penalty', value: 20, tokens: 0, symbol: 'symbol-black-hole.png', message: '¡Agujero Negro!', description: '¡Te traga 20 créditos!' },
    { type: 'prize', value: 15, tokens: 10, symbol: 'symbol-comet.png', message: '¡Cometa Veloz!', description: 'Ganas 15 créditos y 10 tokens.' },
    { type: 'prize', value: 5, tokens: 2, symbol: 'symbol-ufo.png', message: '¡Avistamiento OVNI!', description: 'Ganas 5 créditos y 2 tokens.' },
    { type: 'prize', value: 20, tokens: 15, symbol: 'symbol-nebula.png', message: '¡Nebulosa Mística!', description: 'Ganas 20 créditos y 15 tokens.' },
    { type: 'penalty', value: 10, tokens: 0, symbol: 'symbol-meteor.png', message: '¡Impacto de Meteoro!', description: 'Pierdes 10 créditos.' },
    { type: 'prize', value: 25, tokens: 10, symbol: 'symbol-star.png', message: '¡Estrella Fugaz!', description: 'Ganas 25 créditos y 10 tokens.' },
    { type: 'penalty', value: 25, tokens: 0, symbol: 'symbol-wormhole.png', message: '¡Agujero de Gusano!', description: 'Pierdes 25 créditos.' },
    { type: 'prize', value: 10, tokens: 5, symbol: 'symbol-planet.png', message: '¡Planeta de Premios!', description: 'Ganas 10 créditos y 5 tokens.' },
    { type: 'prize', value: 5, tokens: 2, symbol: 'symbol-ufo.png', message: '¡Avistamiento OVNI!', description: 'Ganas 5 créditos y 2 tokens.' },
];

function createWheel() {
    const angleStep = 360 / SEGMENT_COUNT;
    segments.forEach((seg, i) => {
        const segmentDiv = document.createElement('div');
        segmentDiv.className = 'segment';
        segmentDiv.style.transform = `rotate(${angleStep * i}deg)`;

        const symbolImg = document.createElement('img');
        symbolImg.className = 'symbol';
        // Hide symbols initially
        symbolImg.src = './symbol-hidden.png';
        symbolImg.dataset.finalSrc = `./${seg.symbol}`;

        segmentDiv.appendChild(symbolImg);
        wheel.appendChild(segmentDiv);
    });
}

function updateUI() {
    creditsDisplay.textContent = state.credits;
    tokensDisplay.textContent = state.tokens;
    levelDisplay.textContent = state.level;
    highscoreDisplay.textContent = state.highScore;
    spinButton.disabled = state.credits < SPIN_COST || state.isSpinning;

    if (state.credits === 0 && !state.isSpinning) {
        const modalElement = document.getElementById('outOfCreditsModal');
        if (modalElement && !modalElement.classList.contains('show')) {
            outOfCreditsModal.show();
        }
    }

    const nextThreshold = state.levelThresholds[state.level - 1];
    if (nextThreshold) {
        nextLevelDisplay.textContent = `${nextThreshold} Tokens`;
    } else {
        nextLevelDisplay.textContent = '¡MAX!';
    }
}

function spinWheel() {
    if (state.isSpinning || state.credits < SPIN_COST) return;

    state.isSpinning = true;
    state.credits -= SPIN_COST;

    // Check for low credits after spending
    if (state.credits <= SPIN_COST && !state.lowCreditPromptShown) {
        lowCreditsModal.show();
        state.lowCreditPromptShown = true; // Set flag to true so it doesn't show again
    }

    updateUI();
    audio.playSound('spin');

    // Reset wheel symbols to hidden
    wheel.querySelectorAll('.symbol').forEach(img => img.src = './symbol-hidden.png');

    const randomSpins = Math.floor(Math.random() * 4) + 4; // 4 to 7 full spins
    const randomStopAngle = Math.floor(Math.random() * 360);
    const totalRotation = (randomSpins * 360) + randomStopAngle;

    // We store the current rotation to avoid it snapping back
    const currentRotation = getComputedStyle(wheel).transform;
    const matrix = new DOMMatrix(currentRotation);
    const currentAngle = Math.round(Math.atan2(matrix.m21, matrix.m11) * (180 / Math.PI));

    wheel.style.transition = 'transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)';
    wheel.style.transform = `rotate(${currentAngle + totalRotation}deg)`;

    wheel.addEventListener('transitionend', handleSpinResult, { once: true });
}

function handleSpinResult() {
    const finalTransform = getComputedStyle(wheel).transform;
    const matrix = new DOMMatrix(finalTransform);
    const finalAngle = Math.round(Math.atan2(matrix.m21, matrix.m11) * (180/Math.PI));
    const normalizedAngle = (360 - (finalAngle % 360) + 270) % 360; // Adjust for pointer at top
    
    const segmentAngle = 360 / SEGMENT_COUNT;
    const winningIndex = Math.floor(normalizedAngle / segmentAngle);
    const result = segments[winningIndex];

    // Reveal winning symbol
    const winningSymbolImg = wheel.children[winningIndex].querySelector('.symbol');
    winningSymbolImg.src = winningSymbolImg.dataset.finalSrc;

    if (result.type === 'prize') {
        state.credits += result.value;
        state.tokens += result.tokens;
        if (state.tokens > state.highScore) {
            state.highScore = state.tokens;
            localStorage.setItem('cosmicRouletteHighScore', state.highScore);
        }
        audio.playSound('win');
    } else {
        state.credits -= result.value;
        if (state.credits < 0) state.credits = 0;
        audio.playSound('lose');
    }

    checkLevelUp();
    
    resultMessage.textContent = result.message;
    resultDescription.textContent = result.description;
    resultSymbol.src = `./${result.symbol}`;
    resultModal.show();
    
    state.isSpinning = false;
    updateUI();
}

function checkLevelUp() {
    const currentLevelThreshold = state.levelThresholds[state.level - 1];
    if (currentLevelThreshold && state.tokens >= currentLevelThreshold) {
        state.level++;
        const reward = 50 * state.level;
        state.credits += reward;

        audio.playSound('win');
        
        levelUpMessage.textContent = `¡Felicidades! Has alcanzado el Nivel ${state.level}.`;
        levelUpReward.textContent = `Has recibido un bono de ${reward} créditos.`;
        levelUpModal.show();
    }
}

function handleGoToRecharge() {
    const rechargeSection = document.getElementById('recharge-section');
    if (rechargeSection) {
        rechargeSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function handleRechargeFromLock() {
    outOfCreditsModal.hide();
    handleGoToRecharge();
}

export function addCredits(amount) {
    state.credits += amount;
    state.lowCreditPromptShown = false; // Reset prompt flag on recharge

    // Dismiss the out of credits modal if it's shown
    const modalElement = document.getElementById('outOfCreditsModal');
    if (modalElement && modalElement.classList.contains('show')) {
        outOfCreditsModal.hide();
    }

    audio.playSound('purchase');
    purchaseMessage.textContent = `¡Se han añadido ${amount} créditos a tu cuenta!`;
    purchaseModal.show();
    updateUI();
}

export function initGame() {
    const savedHighScore = localStorage.getItem('cosmicRouletteHighScore');
    if (savedHighScore) {
        state.highScore = parseInt(savedHighScore, 10);
    }
    audio.initAudio();
    createWheel();
    updateUI();
    spinButton.addEventListener('click', spinWheel);
    document.getElementById('go-to-recharge-btn').addEventListener('click', handleGoToRecharge);
    document.getElementById('recharge-from-lock-btn').addEventListener('click', handleRechargeFromLock);
}