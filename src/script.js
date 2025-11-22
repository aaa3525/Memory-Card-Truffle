// Configuration
let provider;
let signer;
let contract;
let userAccount;

// Contract Address from Truffle deployment
const CONTRACT_ADDRESS = "0x57F462795C8Cd692cfdF9a750b2BA9F9AF77c7B0";

// Contract ABI - cleaned version without 'constant' property
const CONTRACT_ABI = [
  "event LeaderboardUpdated(address indexed player, uint256 score)",
  "event ScoreRecorded(address indexed player, uint256 score)",
  "function recordScore(uint256 _score)",
  "function getMyBestScore() view returns (uint256)",
  "function getTopScores() view returns (address[] players, uint256[] scores)",
  "function getTopCount() pure returns (uint256)",
  "function top(uint256) view returns (address player, uint256 score)"
];

// Game Variables
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let timer = 0;
let timerInterval;
let gameActive = false;

// Card symbols (emojis)
const symbols = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎬', '🎸'];

// Initialize ethers.js and Connect Wallet
async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            console.log('Connecting wallet...');
            
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            
            // Initialize ethers provider and signer
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            userAccount = await signer.getAddress();
            
            console.log('Connected account:', userAccount);
            
            // Initialize Contract with ethers
            contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
            console.log('Contract initialized');
            
            // Update UI
            document.getElementById('walletInfo').classList.remove('hidden');
            document.getElementById('walletAddress').textContent = 
                userAccount.substring(0, 6) + '...' + userAccount.substring(38);
            document.getElementById('connectBtn').textContent = 'Connected ✓';
            document.getElementById('connectBtn').disabled = true;
            document.getElementById('contractAddress').textContent = 
                CONTRACT_ADDRESS.substring(0, 6) + '...' + CONTRACT_ADDRESS.substring(38);
            
            // Load blockchain data
            console.log('Loading best score...');
            await loadBestScore();
            console.log('Loading leaderboard...');
            await loadLeaderboard();
            
            showNotification('Wallet connected successfully!', 'success');
        } catch (error) {
            console.error('Wallet connection error:', error);
            showNotification('Failed to connect wallet: ' + error.message, 'error');
        }
    } else {
        showNotification('Please install MetaMask!', 'error');
    }
}

// Load user's best score
async function loadBestScore() {
    if (!contract || !userAccount) {
        console.log('Contract or account not ready');
        return;
    }
    
    try {
        console.log('Calling getMyBestScore...');
        const score = await contract.getMyBestScore();
        console.log('Best score received:', score.toString());
        document.getElementById('bestScore').textContent = score.toString();
    } catch (error) {
        console.error('Error loading best score:', error);
        document.getElementById('bestScore').textContent = '0';
        showNotification('Could not load best score: ' + error.message, 'error');
    }
}

// Load leaderboard
async function loadLeaderboard() {
    if (!contract) {
        console.log('Contract not ready');
        return;
    }
    
    try {
        console.log('Calling getTopScores...');
        const result = await contract.getTopScores();
        console.log('Leaderboard result:', result);
        
        const players = result[0];
        const scores = result[1];
        
        console.log('Players:', players);
        console.log('Scores:', scores.map(s => s.toString()));
        
        const leaderboardDiv = document.getElementById('leaderboardList');
        leaderboardDiv.innerHTML = '';
        
        if (!players || players.length === 0 || players[0] === '0x0000000000000000000000000000000000000000') {
            leaderboardDiv.innerHTML = '<p class="loading">No scores yet. Be the first!</p>';
            return;
        }
        
        for (let i = 0; i < players.length; i++) {
            if (players[i] !== '0x0000000000000000000000000000000000000000') {
                const entry = document.createElement('div');
                entry.className = 'leaderboard-entry';
                entry.innerHTML = `
                    <span class="rank">#${i + 1}</span>
                    <span class="player">${players[i].substring(0, 6)}...${players[i].substring(38)}</span>
                    <span class="score">${scores[i].toString()}</span>
                `;
                leaderboardDiv.appendChild(entry);
            }
        }
    } catch (error) {
        console.error('Error loading leaderboard:', error);
        const leaderboardDiv = document.getElementById('leaderboardList');
        leaderboardDiv.innerHTML = '<p class="loading">Error loading leaderboard</p>';
        showNotification('Could not load leaderboard: ' + error.message, 'error');
    }
}

// Submit score to blockchain
async function submitScore() {
    if (!contract || !userAccount) {
        showNotification('Please connect your wallet first', 'error');
        return;
    }
    
    const score = calculateScore();
    
    try {
        showNotification('Submitting score to blockchain...', 'info');
        
        const tx = await contract.recordScore(score);
        console.log('Transaction sent:', tx.hash);
        
        showNotification('Transaction sent! Waiting for confirmation...', 'info');
        
        await tx.wait();
        console.log('Transaction confirmed!');
        
        showNotification('Score recorded successfully!', 'success');
        
        // Refresh blockchain data
        await loadBestScore();
        await loadLeaderboard();
    } catch (error) {
        console.error('Error submitting score:', error);
        showNotification('Failed to submit score: ' + error.message, 'error');
    }
}

// Calculate score based on moves and time
function calculateScore() {
    // Score = 10000 - (moves * 10) - (time * 5)
    // Lower moves and time = higher score
    const score = Math.max(0, 10000 - (moves * 10) - (timer * 5));
    return score;
}

// Initialize game
function initGame() {
    // Reset game state
    matchedPairs = 0;
    moves = 0;
    timer = 0;
    flippedCards = [];
    gameActive = true;
    
    // Reset UI
    document.getElementById('moves').textContent = '0';
    document.getElementById('timer').textContent = '0';
    document.getElementById('gameResult').classList.add('hidden');
    
    // Create card pairs
    cards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
    
    // Render game board
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    
    cards.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
        card.dataset.symbol = symbol;
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">?</div>
                <div class="card-back">${symbol}</div>
            </div>
        `;
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
    
    // Start timer
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timer++;
        document.getElementById('timer').textContent = timer;
    }, 1000);
}

// Flip card
function flipCard() {
    if (!gameActive) return;
    if (this.classList.contains('flipped') || this.classList.contains('matched')) return;
    if (flippedCards.length >= 2) return;
    
    this.classList.add('flipped');
    flippedCards.push(this);
    
    if (flippedCards.length === 2) {
        moves++;
        document.getElementById('moves').textContent = moves;
        checkMatch();
    }
}

// Check for match
function checkMatch() {
    const [card1, card2] = flippedCards;
    const symbol1 = card1.dataset.symbol;
    const symbol2 = card2.dataset.symbol;
    
    if (symbol1 === symbol2) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        flippedCards = [];
        matchedPairs++;
        
        if (matchedPairs === symbols.length) {
            endGame();
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

// End game
function endGame() {
    gameActive = false;
    clearInterval(timerInterval);
    
    const score = calculateScore();
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameResult').classList.remove('hidden');
}

// Show notification
function showNotification(message, type) {
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Event Listeners
document.getElementById('connectBtn').addEventListener('click', connectWallet);
document.getElementById('newGameBtn').addEventListener('click', initGame);
document.getElementById('submitScoreBtn').addEventListener('click', submitScore);
document.getElementById('refreshScoreBtn').addEventListener('click', loadBestScore);
document.getElementById('refreshLeaderboardBtn').addEventListener('click', loadLeaderboard);

// Auto-connect if already connected
window.addEventListener('load', async () => {
    if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
            await connectWallet();
        }
    }
});