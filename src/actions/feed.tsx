"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TaskCon from "../../artifacts-zk/contracts/TaskCon.sol/TaskCon.json";
import MyTokenContract from "../../artifacts-zk/contracts/Tokens.sol/MyTokenContract.json";
import { ethers } from "ethers";
import { getContractAddress } from "ethers/lib/utils";
import { Button } from "@/components/ui/button";
import { useConfig, useReadContract } from "wagmi";
import config from "./../app/config";
import Web3, { PrimitiveTupleType } from "Web3";
import { projectId } from "@/config";

const ProjectTitles: string[] = [];
const ProjectDescs: string[] = [];
const Urls: string[] = [];
const Tasks: { title: string; desc: string; isDone: boolean }[] = [];
const TaskTitle: string[] = [];
const TaskDesc: string[] = [];
const TaskStatus: string[] = [];

let Counter:number = (ProjectTitles.length) + 1;
console.log(Counter)


const Feed: React.FC = () => {
  const [data, setdata] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const web3 = new Web3(
    "https://sepolia.infura.io/v3/e84a2946755345209aa59f4a1645f14a"
  );

  if (!(window as any).ethereum) {
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

  const handleButtonClick = async (taskTitle: string) => {
    const sender = (window as any).ethereum.selectedAddress.toString();
    // console.log("Project ID type", typeof(projectId));
    console.log("Task Title:", taskTitle);
    console.log("Sender:", sender);

    try {
      const tx = await ContractWithSigner.finishtask(Counter, taskTitle, sender);
      console.log(tx)
      console.log(tx.receipt)
      console.log(tx.data)
    } catch (error) {
      console.log("error:", error);
    }
  };



  Fetchdata();

  useEffect(() => {
    Fetchdata();
  }, []);

  if (data) {
    data.forEach((project: any) => {
      ProjectTitles.push(project.title);
      ProjectDescs.push(project.projectdesc);
      Urls.push(project.url);

      project.tasks.forEach((task: any) => {
        TaskTitle.push(task.tasktitle);
        TaskDesc.push(task.taskdesc || "");
        TaskStatus.push(task.taskstatus);

        Tasks.push({
          title: task.tasktitle,
          desc: task.taskdesc,
          isDone: task.taskstatus || "",
        });
      });
    });
  } else {
    console.log("not fetched");
  }

  return (
    <>
      <Button onClick={() => console.log(data)}>
        See what everyone is doing
      </Button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {data.map((project: any, index: number) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <h2>{project.title}</h2>
              <ul>
                {project.tasks.map((task: any, taskIndex: number) => (
                  <li key={taskIndex}>
                    <span>{task.tasktitle}</span>
                    <span>{task.isdone ? " (Done)" : " (Not Done)"}</span>
                    <Button
                      onClick={() =>
                        handleButtonClick(task.tasktitle)
                      }
                    >
                      Mark as done
                    </Button>
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
