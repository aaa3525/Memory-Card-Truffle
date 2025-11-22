// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MemoryScores {
    struct Entry {
        address player;
        uint256 score;
    }

    // mapping from player address -> best score
    mapping(address => uint256) private bestScores;

    // top N leaderboard (sorted descending by score). N = 5
    Entry[5] public top; // fixed size array

    event ScoreRecorded(address indexed player, uint256 score);
    event LeaderboardUpdated(address indexed player, uint256 score);

    // write: record a score for msg.sender
    function recordScore(uint256 _score) external {
        require(_score >= 0, "Invalid score"); // guard

        // update player's best score if new score is better (higher)
        uint256 prev = bestScores[msg.sender];
        if (_score > prev) {
            bestScores[msg.sender] = _score;
            emit ScoreRecorded(msg.sender, _score);

            // try to insert/update in top leaderboard
            _insertLeaderboard(msg.sender, _score);
        }
    }

    // internal: insert a new top score into the fixed-size top array (top[0] highest)
    function _insertLeaderboard(address _player, uint256 _score) internal {
        // If player's already in leaderboard with lower score, remove old entry
        for (uint i = 0; i < top.length; i++) {
            if (top[i].player == _player) {
                if (_score <= top[i].score) return; // no change needed
                // shift elements left from i to end to remove old
                for (uint j = i; j + 1 < top.length; j++) {
                    top[j] = top[j + 1];
                }
                top[top.length - 1] = Entry(address(0), 0);
                break;
            }
        }

        // find insertion index for new score (higher is better)
        for (uint i = 0; i < top.length; i++) {
            if (top[i].player == address(0) || _score > top[i].score) {
                // shift lower entries down starting from the bottom
                for (uint j = top.length - 1; j > i; j--) {
                    top[j] = top[j - 1];
                }
                top[i] = Entry(_player, _score);
                emit LeaderboardUpdated(_player, _score);
                break;
            }
        }
    }

    // read: get caller's best score
    function getMyBestScore() external view returns (uint256) {
        return bestScores[msg.sender];
    }

    // read: return top leaderboard entries (as arrays)
    function getTopScores() external view returns (address[] memory players, uint256[] memory scores) {
        uint256 len = top.length;
        players = new address[](len);
        scores = new uint256[](len);
        for (uint i = 0; i < len; i++) {
            players[i] = top[i].player;
            scores[i] = top[i].score;
        }
    }

    // optional helper: get how many leaderboard slots (constant = 5)
    function getTopCount() external pure returns (uint256) {
        return 5;
    }
}
