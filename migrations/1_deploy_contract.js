const MemoryScores = artifacts.require("MemoryScores");

module.exports = function (deployer) {
  deployer.deploy(MemoryScores);
};