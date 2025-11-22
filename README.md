# Memory Game dApp - Truffle Edition

🎮 A blockchain-based memory game with on-chain score tracking using Truffle Suite and Ganache local blockchain.

## 📋 Overview

This project is a decentralized application (dApp) that combines a fun Memory Card Game with on-chain score tracking. Players connect their wallet, play the game, and record their scores directly on a local blockchain using Truffle and Ganache.

### Key Improvements from Assignment 2:
- ✅ Deployed using **Truffle Suite** instead of Remix
- ✅ Running on **Ganache local blockchain**
- ✅ Professional development workflow
- ✅ Automated deployment with migration scripts
- ✅ Better project structure and organization

---

## 🎯 Features

- 🧩 Interactive memory card game built with HTML, CSS, JavaScript
- 🔗 Integrated with Web3.js for blockchain interaction
- 💾 Records player scores on the blockchain
- 🧠 Displays top 5 players and personal best scores
- 🎮 Score based on moves and time (lower is better)
- 💅 Smooth animations and responsive design

---

## 🧰 Technologies Used

| Component | Technology |
|-----------|-----------|
| Smart Contract | Solidity ^0.8.19 |
| Development Framework | Truffle Suite |
| Local Blockchain | Ganache |
| Frontend | HTML, CSS, JavaScript |
| Blockchain Library | Web3.js |
| IDE | VS Code |

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v16 or higher)
   - Download: https://nodejs.org/
   - Verify: `node --version` and `npm --version`

2. **Truffle Suite**
   ```bash
   npm install -g truffle
   ```

3. **Ganache** (GUI or CLI)
   - GUI: https://archive.trufflesuite.com/ganache/
   - CLI: `npm install -g ganache`

4. **MetaMask Browser Extension**
   - Download: https://metamask.io/

---

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd memory-game-truffle
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Start Ganache

**Option A - GUI:**
1. Open Ganache application
2. Click "Quickstart" or create a new workspace
3. Note the RPC Server address (default: HTTP://127.0.0.1:7545)

**Option B - CLI:**
```bash
ganache
```
(Default port: 8545 - update `truffle-config.js` if using CLI)

### Step 4: Compile the Smart Contract

```bash
truffle compile
```

Expected output:
```
Compiling your contracts...
✓ Fetching solc version list from solc-bin
✓ Downloading compiler
✓ Compiling ./contracts/MemoryScores.sol
✓ Artifacts written to build/contracts
✓ Compiled successfully
```

### Step 5: Deploy to Ganache

```bash
truffle migrate
```

Expected output:
```
Starting migrations...
======================
> Network name:    'development'
> Network id:      5777
> Block gas limit: 6721975

1_deploy_contract.js
====================

   Deploying 'MemoryScores'
   ------------------------
   > transaction hash:    0x...
   > contract address:    0x...
   > block number:        1
   > account:             0x...
   > balance:             99.99...
   > gas used:            ...
   > gas price:           ...
   > value sent:          0 ETH

   ✓ MemoryScores deployed successfully
```

**IMPORTANT:** Copy the contract address from the output!

### Step 6: Update Frontend with Contract Address

1. Open `src/script.js`
2. Find line 8:
   ```javascript
   const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS_HERE";
   ```
3. Replace with your actual contract address from Step 5:
   ```javascript
   const CONTRACT_ADDRESS = "0xYourActualContractAddress";
   ```

### Step 7: Configure MetaMask

1. Open MetaMask
2. Click network dropdown → "Add Network" → "Add a network manually"
3. Enter the following details:
   - **Network Name:** Ganache Local
   - **RPC URL:** http://127.0.0.1:7545 (or 8545 if using CLI)
   - **Chain ID:** 1337 (or 5777 for GUI)
   - **Currency Symbol:** ETH
4. Click "Save"
5. Import a Ganache account:
   - Copy a private key from Ganache
   - MetaMask → Account icon → "Import Account"
   - Paste private key

### Step 8: Run the Frontend

**Option A - Using Live Server (VS Code):**
1. Install "Live Server" extension in VS Code
2. Right-click `src/index.html` → "Open with Live Server"

**Option B - Simple HTTP Server:**
```bash
cd src
python -m http.server 8000
```
Then open: http://localhost:8000

---

## 🎮 How to Use

1. **Connect Wallet**
   - Click "Connect Wallet" button
   - Approve MetaMask connection
   - Ensure you're on Ganache network

2. **Play the Game**
   - Click "New Game" to start
   - Click cards to flip and find matching pairs
   - Try to complete with fewer moves and less time

3. **Submit Score**
   - After game completion, click "Submit Score to Blockchain"
   - Confirm the transaction in MetaMask
   - Wait for confirmation

4. **View Results**
   - Your best score updates automatically
   - Check the leaderboard for top 5 players
   - Click "Refresh" buttons to update blockchain data

---

## 📂 Project Structure

```
memory-game-truffle/
├── contracts/
│   └── MemoryScores.sol          # Smart contract
├── migrations/
│   └── 1_deploy_contract.js      # Deployment script
├── src/
│   ├── index.html                # Main HTML file
│   ├── script.js                 # Frontend JavaScript
│   └── style.css                 # Styling
├── test/                         # Tests (optional)
├── build/                        # Compiled contracts (generated)
├── truffle-config.js             # Truffle configuration
├── package.json                  # Node dependencies
├── screenshots/                  # Documentation screenshots
└── README.md                     # This file
```

---

## 🧪 Testing

### Manual Testing Checklist:

- [ ] Contract compiles without errors
- [ ] Contract deploys successfully to Ganache
- [ ] Wallet connects to Ganache network
- [ ] Game starts and cards flip correctly
- [ ] Game completes and calculates score
- [ ] Score submits to blockchain (MetaMask transaction)
- [ ] Best score displays correctly
- [ ] Leaderboard updates after submission
- [ ] Multiple accounts can submit scores
- [ ] Top 5 leaderboard shows correct rankings

### Automated Tests (Optional):

Create `test/MemoryScores.test.js`:
```bash
truffle test
```

---

## 📸 Screenshots

Include the following screenshots in your submission:

1. **Truffle Compile Output** - `truffle compile` success message
2. **Truffle Migration Output** - Contract deployment with address
3. **Ganache Dashboard** - Showing blocks and transactions
4. **Frontend UI** - Connected wallet and game board
5. **MetaMask Transaction** - Score submission confirmation
6. **Leaderboard** - Top scores displayed
7. **Best Score** - Personal score update

---

## 🔧 Troubleshooting

### Issue: "Error: Network id mismatch"
**Solution:** Check Ganache chain ID matches `truffle-config.js`

### Issue: "Insufficient funds"
**Solution:** Ensure you imported a Ganache account with ETH

### Issue: "Contract not deployed"
**Solution:** Run `truffle migrate --reset` to redeploy

### Issue: "Web3 not defined"
**Solution:** Ensure you're using a local server (not file://)

### Issue: MetaMask doesn't connect
**Solution:** 
- Clear MetaMask cache
- Re-import Ganache account
- Check RPC URL matches Ganache

---

## 📝 Smart Contract Details

### Contract: MemoryScores

**Functions:**

| Function | Type | Description |
|----------|------|-------------|
| `recordScore(uint256 _score)` | Write | Records a player's score |
| `getMyBestScore()` | Read | Returns caller's best score |
| `getTopScores()` | Read | Returns top 5 players and scores |
| `getTopCount()` | Pure | Returns leaderboard size (5) |

**Events:**
- `ScoreRecorded(address indexed player, uint256 score)`
- `LeaderboardUpdated(address indexed player, uint256 score)`

---

## 🎓 Learning Outcomes

This assignment demonstrates:

- ✅ Professional blockchain development workflow
- ✅ Local blockchain testing with Ganache
- ✅ Smart contract compilation and deployment
- ✅ Web3.js integration with frontend
- ✅ Transaction signing and confirmation
- ✅ Reading blockchain state
- ✅ Event listening and UI updates

---

## 👩‍💻 Author

**Name:** Amnah Asrar  
**Course:** Blockchain Development  
**Instructor:** Dr. Usama Arshad  
**Date:** November 2025  
**Assignment:** #3 - Truffle Deployment  

---

## 📚 Resources

- Truffle Documentation: https://archive.trufflesuite.com/docs/
- Ganache: https://archive.trufflesuite.com/ganache/
- Web3.js Documentation: https://web3js.readthedocs.io/
- Solidity Documentation: https://docs.soliditylang.org/

---

## 📦 Submission Checklist

- All code files included in correct folders
- `truffle-config.js` properly configured
- Migration script created
- Contract address updated in `script.js`
- README.md complete with setup instructions
- Screenshots folder with all required images
-  GitHub repository link included
-  ZIP file created with proper structure
-  Project runs successfully after following README

---

## 🔗 GitHub Repository

Repository Link: 

---

## 📄 License

MIT License - Educational purposes only

---

**Note:** This project uses a local Ganache blockchain for development and testing. For production deployment, consider using testnets (Sepolia, Goerli) or mainnet with proper security audits.
