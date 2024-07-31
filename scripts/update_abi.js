import { addressesAndHashes } from "./deploy.js";
import TaskCon from "../artifacts-zk/contracts/TaskCon.sol/TaskCon.json" with { type: "json" };
import MyTokenContract from "../artifacts-zk/contracts/Tokens.sol/MyTokenContract.json" with { type: "json" };

const TaskCon_networks = {
  1115511: {
    address: addressesAndHashes.taskConAddress,
    transactionHash: addressesAndHashes.taskConTransactionHash,
  },
};

const MyTokenContract_networks = {
  1115511: {
    address: addressesAndHashes.myTokenContractAddress,
    transactionHash: addressesAndHashes.myTokenContractTransactionHash,
  },
};

if (!TaskCon.hasOwnProperty("networks")) {
  Object.defineProperty(TaskCon, "networks", {
    value: {},
    writable: true,
    enumerable: true,
    configurable: true,
  });
  Object.assign(TaskCon.networks, TaskCon_networks);
}

if (!MyTokenContract.hasOwnProperty("networks")) {
  Object.defineProperty(MyTokenContract, "networks", {
    value: {},
    writable: true,
    enumerable: true,
    configurable: true,
  });
  Object.assign(MyTokenContract.networks, MyTokenContract_networks);
}