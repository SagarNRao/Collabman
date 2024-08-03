import { useReadContract } from "wagmi";
import TaskCon from "./../../artifacts-zk/contracts/TaskCon.sol/TaskCon.json";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

interface task {
  tasktitle: string;
  isdone: boolean;
}

interface project {
  projecttitle: string;
  tasks: task[];
}

function ReadContract() {
  const abi = TaskCon.abi;
  console.log("trying hook");
  const result = useReadContract({
    abi: [
      {
        inputs: [],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "address",
            name: "recipient",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "projectid",
            type: "uint256",
          },
        ],
        name: "AddProject",
        type: "event",
      },
      {
        inputs: [],
        name: "Counter",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "string",
            name: "_title",
            type: "string",
          },
          {
            internalType: "string",
            name: "_description",
            type: "string",
          },
          {
            internalType: "string",
            name: "_url",
            type: "string",
          },
          {
            components: [
              {
                internalType: "string",
                name: "tasktitle",
                type: "string",
              },
              {
                internalType: "string",
                name: "description",
                type: "string",
              },
              {
                internalType: "bool",
                name: "isdone",
                type: "bool",
              },
            ],
            internalType: "struct TaskCon.task[]",
            name: "_tasks",
            type: "tuple[]",
          },
        ],
        name: "addProject",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "projectId",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "tasktitle",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
        ],
        name: "addtasks",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "projectId",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "tasktitle",
            type: "string",
          },
        ],
        name: "finishtask",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "projectId",
            type: "uint256",
          },
        ],
        name: "getProjectTasks",
        outputs: [
          {
            components: [
              {
                internalType: "string",
                name: "tasktitle",
                type: "string",
              },
              {
                internalType: "string",
                name: "description",
                type: "string",
              },
              {
                internalType: "bool",
                name: "isdone",
                type: "bool",
              },
            ],
            internalType: "struct TaskCon.task[]",
            name: "",
            type: "tuple[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getfeed",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "owner",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        name: "projects",
        outputs: [
          {
            internalType: "string",
            name: "title",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "string",
            name: "url",
            type: "string",
          },
          {
            internalType: "string",
            name: "projectid",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "tokenaddress",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    address: "0x3dFd82E6f8760CCcA6298CF6D75B25Eda80FD6E5",
    functionName: "getfeed",
  });
  console.log("after hook");

  console.log(result);

  if (!Array.isArray(result)) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {result.map((project: project, index: number) => (
        <div key={index}>
          <h3>{project.projecttitle}</h3>
          <ul>
            {project.tasks.map((task: task, taskId: number) => (
              <li key={taskId}>
                {task.tasktitle} - {task.isdone ? "Done" : "Not Done"}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default ReadContract;
