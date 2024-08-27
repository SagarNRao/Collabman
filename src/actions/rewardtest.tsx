import Web3 from "Web3";
import TaskTokenRewards from "../../artifacts-zk/contracts/TokenTest.sol/TestTokenReward.json";

// Set up Web3 provider
const web3 = new Web3(
  "https://sepolia.infura.io/v3/e84a2946755345209aa59f4a1645f14a"
);

// Set up contract instance
const contractAddress = "0x0x56922E1604b42D2f0a3D6551658a7d43D609bc4E";
const contractABI = TaskTokenRewards.abi;
const contract = new web3.eth.Contract(contractABI, contractAddress);


// Button click handler
(document as any)
  .getElementById("claim-tokens-button")
  .addEventListener("click", async () => {
    try {
      // Call the claimTokens() function
      await contract.methods.claimTokens().send({ from: userAddress });
      console.log("Tokens claimed successfully!");
    } catch (error) {
      console.error("Error claiming tokens:", error);
    }
  });
