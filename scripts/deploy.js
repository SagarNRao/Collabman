async function main() {
    // Ensure the Hardhat Runtime Environment is correctly imported
    const hre = require("hardhat");
    const ethers = hre.ethers;

    // Get the deployer's signer
    const [deployer] = await ethers.getSigners();

    // Deploy your contract (replace with your actual contract factory)
    const MyContract = await ethers.getContractFactory("TaskCon"); // Replace with your contract name
    const myContract = await MyContract.deploy();

    const MyTokenContract = await ethers.getContractFactory("MyTokenContract"); // Replace with your contract name
    const myTokenContract = await MyTokenContract.deploy();

    // Wait for deployment confirmation
    await myContract.deployed();
    await myTokenContract.deployed();

    console.log("TaskCon deployed at:", myContract.address);
    console.log("TaskCon Transaction Hash: ", myContract.deployTransaction.hash);
    console.log("")
    console.log("MyTokenContract deployed at:", myTokenContract.address);
    console.log("MyTokenContract Transaction Hash: ", myTokenContract.deployTransaction.hash);
    console.log("Deployer's address:", deployer.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });