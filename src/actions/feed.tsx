"use client";
import React, { useEffect, useState } from "react";
import TaskCon from "../../artifacts-zk/contracts/TaskCon.sol/TaskCon.json";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import Web3 from "Web3";
import { Badge } from "@/components/ui/badge";

const ProjectIds: string[] = [];
const ProjectTitles: string[] = [];
const ProjectDescs: string[] = [];
const Urls: string[] = [];
const Tasks: { title: string; desc: string; isDone: boolean }[] = [];
const TaskTitle: string[] = [];
const TaskDesc: string[] = [];
const TaskStatus: boolean[] = [];

interface Project {
  title: string;
  description: string;
  url: string;
  tasks: Task[];
  projectid: string;
  ownerman: "0x6B3eaB2E94435D2F808D75eAfDA7C9431706eBF2";
}

interface Task {
  tasktitle: string;
  description: string;
  isdone: boolean;
  ownerman: "0x6B3eaB2E94435D2F808D75eAfDA7C9431706eBF2";
}

let Counter: number = ProjectTitles.length + 1;
console.log(Counter);

const Feed: React.FC = () => {
  const [data, setdata] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const web3 = new Web3(
    "https://sepolia.infura.io/v3/e84a2946755345209aa59f4a1645f14a"
  );

  if (!(typeof window !== "undefined" && (window as any).ethereum)) {
    alert("Please install MetaMask");
  }
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);

  const Contract = new ethers.Contract(
    TaskCon.networks[11155111].address,
    TaskCon.abi,
    provider
  );
  const ContractWithSigner = new ethers.Contract(
    TaskCon.networks[11155111].address,
    TaskCon.abi,
    provider.getSigner()
  );

  const Fetchdata = async () => {
    try {
      const TaskConAbi = TaskCon.abi;
      const TaskConAddress = TaskCon.networks[11155111].address;

      try {
        const result = await Contract.getfeed();
        const parsedData = JSON.parse(result);
        setdata(parsedData);
      } catch (error) {
        console.error("Error getting feed: ", error);
      }
    } catch {
      console.log("oops");
    } finally {
      setLoading(false);
    }
  };

  if (data) {
    data.forEach((project: Project) => {
      ProjectTitles.push(project.title);
      ProjectDescs.push(project.description);
      Urls.push(project.url);
      // Add projectid to the array
      ProjectIds.push(project.projectid);

      project.tasks.forEach((task: Task) => {
        TaskTitle.push(task.tasktitle);
        TaskDesc.push(task.description);
        TaskStatus.push(task.isdone);

        Tasks.push({
          title: task.tasktitle,
          desc: task.description,
          isDone: task.isdone,
        });
      });
    });
  } else {
    console.log("not fetched");
  }

  const MarkAsDone = async (ProjectTitle: string, taskTitle: string) => {
    const sender = (window as any).ethereum.selectedAddress.toString();
    console.log("Task Title:", taskTitle);
    console.log("Sender:", sender);

    try {
      const tx = await ContractWithSigner.finishtask(ProjectTitle, taskTitle, sender);
      console.log(tx);
      console.log(tx.receipt);
      console.log(tx.data);
      // Find the index of the t with the given title
      if (tx) {
        const taskIndex = TaskTitle.indexOf(taskTitle);

        // Update the t status
        TaskStatus[taskIndex] = true;

        // Update the T array
        Tasks[taskIndex].isDone = true;

        // Update the data state
        const newData = [...data];
        newData.forEach((project: Project) => {
          project.tasks.forEach((task: Task, taskIndex: number) => {
            if (task.tasktitle === taskTitle) {
              console.log(task);
              task.isdone = true;
              console.log(task);
            }
          });
        });
        setdata(newData);
        console.log("New data ", newData);
      } else {
        console.log("Unidentified error");
      }

      // Call the finishtask function on the contract

      // Call the Fetchdata function to update the data state
    } catch (error) {
      console.log("error:", error);
    }
  };

  return (
    <>
      <Button onClick={Fetchdata}>See what everyone is doing</Button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {data.map((project: Project, index: number) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <h2>{project.title}</h2>
              <p>{project.description}</p>
              <ul>
                {project.tasks.map((task: Task, taskIndex: number) => (
                  <li key={taskIndex}>
                    <span>{task.tasktitle}</span>
                    {task.isdone ? (
                      <Badge>Done</Badge>
                    ) : (
                      <>
                        <Badge>Not done</Badge>
                        <Button
                          onClick={() =>
                            MarkAsDone(project.title, task.tasktitle)
                          }
                        >
                          Mark as done
                        </Button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
// const [data,setdata]
export default Feed;
