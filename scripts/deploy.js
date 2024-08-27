const { ethers } = require("hardhat");

async function main() {
    // Ensure the Hardhat Runtime Environment is correctly imported
    const hre = require("hardhat");
    const ethers = hre.ethers;

    // Get the deployer's signer
    const [deployer] = await ethers.getSigners();

    // Deploy your contract (replace with your actual contract factory)
    const TaskCon = await ethers.getContractFactory("TaskCon"); // Replace with your contract name
    const TaskContract = await TaskCon.deploy();

    // Wait for deployment confirmation
    await TaskContract.deployed();

    const depositTx = await TaskContract.deposit({ value: ethers.utils.parseEther("1.0") });
    await depositTx.wait();

    console.log("TaskCon deployed at:", TaskContract.address);
    console.log("TaskCon Transaction Hash: ", TaskContract.deployTransaction.hash);

    const balance = await TaskCon.getContractBalance();
    console.log("Contract balance: ", ethers.utils.formatEther(balance));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });