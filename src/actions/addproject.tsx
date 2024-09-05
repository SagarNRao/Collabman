"use client";

import React from "react";
import TaskCon from "../../artifacts-zk/contracts/TaskCon.sol/TaskCon.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Web3, { PrimitiveTupleType } from "Web3";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HoverCard } from "@/components/ui/hover-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Table } from "@/components/ui/table";

interface Project {
  title: string;
  description: string;
  url: string;
  tasks: Task[];
  ownerman: string;
}

interface Task {
  tasktitle: string;
  description: string;
  isdone: number;
  ownerman: string;
  collaborator: string;
  reward: number;
}

interface Props {
  contractInstance: any; // Replace with the actual type of your contract instance
  account: string; // The current user's Ethereum account
}

const ProjectForm: React.FC<Props> = ({ contractInstance, account }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [tasks, setTasks] = useState<[Task, ...Task[]]>(
    [] as unknown as [Task, ...Task[]]
  );

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [reward, setReward] = useState<number>(0);

  const [cardContents, setCardContents] = useState([
    { title: "", description: "", reward: 0 },
  ]);

  const handleAddTask = () => {
    const Owner = (window as any).ethereum.selectedAddress.toString();

    const newTask: Task = {
      tasktitle: newTaskTitle,
      description: newTaskDescription,
      isdone: 0,
      ownerman: Owner,
      collaborator: "",
      reward: reward,
    };
    setTasks([...tasks, newTask] as [Task, ...Task[]]);
    setNewTaskTitle("");
    setNewTaskDescription("");

    setCardContents([
      ...cardContents,
      { title: "", description: "", reward: 0 },
    ]);
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
      const Owner = (window as any).ethereum.selectedAddress.toString();

      const tx = await contract.addProject(
        title,
        description,
        url,
        tasks,
        Owner
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
      <Card>
        <CardContent className="max-w-600px">
          <CardTitle style={{ paddingTop: "20px" }}>Project Title</CardTitle>
          <CardDescription>
            Recommended to use the name of your repo to prevent confusion
          </CardDescription>
        </CardContent>
        <CardContent style={{ paddingBottom: "1px" }}>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </CardContent>
        <CardContent className="max-w-600px" style={{ paddingBottom: "1px" }}>
          Description:
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </CardContent>
        <CardContent>
          URL:
          <Input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </CardContent>
        <CardContent>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>Make a to-do list for your project</CardDescription>
        </CardContent>
        <CardContent className="p-0">
          <div className="flex max-w-600px" id="first">
            <div>
              {cardContents.map((cardContent, index) => (
                <CardContent key={index}>
                  <div className="flex">
                    <Input
                      type="text"
                      value={cardContent.title}
                      onChange={(e) => {
                        const newCardContents = [...cardContents];
                        newCardContents[index].title = e.target.value;
                        setCardContents(newCardContents);
                        setNewTaskTitle(e.target.value);
                      }}
                      placeholder="Task title"
                    />
                    <div className="p-2"></div>
                    <Input
                      value={cardContent.description}
                      onChange={(e) => {
                        const newCardContents = [...cardContents];
                        newCardContents[index].description = e.target.value;
                        setCardContents(newCardContents);
                        setNewTaskDescription(e.target.value);
                      }}
                      placeholder="Task description"
                    />
                    <div className="p-2"></div>
                    <Input
                      // typ
                      // value={cardContent.reward}
                      onChange={(e) => {
                        const newCardContents = [...cardContents];
                        newCardContents[index].reward = parseInt(
                          e.target.value
                        );
                        setCardContents(newCardContents);
                        setReward(parseInt(e.target.value));
                      }}
                    ></Input>
                    <div className="p-2"></div>
                    <Button type="button" onClick={handleAddTask}>
                      Add Task
                    </Button>
                  </div>
                </CardContent>
              ))}
            </div>
          </div>
        </CardContent>
        <CardContent>
          <Button type="submit" style={{ width: "100%" }}>
            Add Project
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};

export default ProjectForm;
