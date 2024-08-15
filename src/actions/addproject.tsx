"use client";

import React from "react";
import TaskCon from "../../artifacts-zk/contracts/TaskCon.sol/TaskCon.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Web3, { PrimitiveTupleType } from "Web3";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
// import { Table } from "@/components/ui/table";

interface Project {
  title: string;
  description: string;
  url: string;
  tasks: Task[];
  ownerman: "0x89546b75e0e91b41938e14fecfd8228f2ddf9182ecb2fc38e7f0f0f31db6b17b";
}

interface Task {
  tasktitle: string;
  description: string;
  isdone: boolean;
  ownerman: "0x89546b75e0e91b41938e14fecfd8228f2ddf9182ecb2fc38e7f0f0f31db6b17b";
}

interface Props {
  contractInstance: any; // Replace with the actual type of your contract instance
  account: string; // The current user's Ethereum account
}

const ProjectForm: React.FC<Props> = ({ contractInstance, account }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [tasks, setTasks] = useState<[Task, ...Task[]]>([] as unknown as [Task, ...Task[]]);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");

  const handleAddTask = () => {
    const newTask: Task = {
      tasktitle: newTaskTitle,
      description: newTaskDescription,
      isdone: false,
      ownerman:
        "0x89546b75e0e91b41938e14fecfd8228f2ddf9182ecb2fc38e7f0f0f31db6b17b",
    };
    setTasks([...tasks, newTask] as [Task, ...Task[]]);
    setNewTaskTitle("");
    setNewTaskDescription("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const web3 = new Web3(
        "https://sepolia.infura.io/v3/e84a2946755345209aa59f4a1645f14a"
      );

      if (!(window as any).ethereum) {
        alert("Please install MetaMask");
      }
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        TaskCon.networks[11155111].address,
        TaskCon.abi,
        signer
      );

      await (window as any).ethereum.request({ method: "eth_requestAccounts" });

      const accounts = await provider.listAccounts();
      if (accounts.length == 0) {
        throw new Error("No accounts found--");
      }
      const account = accounts[0];

      // const posttitle = title;
      // const postdescription = description;
      // const posturl = url;

      const tx = await contract.addProject(
        title,
        description,
        url,
        tasks,
        "0x89546b75e0e91b41938e14fecfd8228f2ddf9182ecb2fc38e7f0f0f31db6b17b"
      );
      console.log("Transaction successful:", tx);

      // await contractInstance.methods
      //   .addProject(title, description, url, tasks)
      //   .send({ from: account });
      // console.log('Project added successfully!');
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <br />
      <label>
        Description:
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <br />
      <label>
        URL:
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </label>
      <br />
      <h2>Tasks:</h2>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            {task.tasktitle}: {task.description}
          </li>
        ))}
      </ul>
      <label>
        New Task Title:
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
      </label>
      <br />
      <label>
        New Task Description:
        <Textarea
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
        />
      </label>
      <br />
      <Button type="button" onClick={handleAddTask}>
        Add Task
      </Button>
      <br />
      <Button type="submit">Add Project</Button>
    </form>
  );
};

export default ProjectForm;
