"use client";
import React, { useEffect, useState } from "react";
import TaskCon from "../../artifacts-zk/contracts/TaskCon.sol/TaskCon.json";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import Web3 from "Web3";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

interface Attempt {
  projectId: number;
  taskId: number;
  tasktitle: string;
  collaborator: string;
  status: boolean;
}

const ProjectIds: string[] = [];
const ProjectTitles: string[] = [];
const ProjectDescs: string[] = [];
const Urls: string[] = [];
// const Tasks: { title: string; desc: string; isDone: boolean }[] = [];
const Tasks: {
  title: string;
  desc: string;
  isDone: boolean;
  attempt: Attempt;
}[] = [];
const TaskTitle: string[] = [];
const TaskDesc: string[] = [];
const TaskStatus: boolean[] = [];
const Attempts: Attempt[] = [];

let Counter: number = ProjectTitles.length + 1;
console.log(Counter);

const Feed = () => {
  const [data, setdata] = useState<any>(null);
  const [attemptsdata, setattemptsdata] = useState<any>(null);
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

  const FetchAttemptsData = async () => {
    try {
      const TaskConAbi = TaskCon.abi;
      const TaskConAddress = TaskCon.networks[11155111].address;

      try {
        const result = await Contract.getattempts();
        console.log(result);
        const parsedData = JSON.parse(result);
        console.log("parsed data: ",parsedData);
        parsedData.forEach((attempt:Attempt) => {
          Attempts.push({
            projectId: attempt.projectId,
            taskId: attempt.taskId,
            tasktitle: attempt.tasktitle,
            collaborator: attempt.collaborator,
            status: attempt.status,
          });
        });
        setattemptsdata(result);
        console.log("Attempts after parsing: ", Attempts);

      } catch (error) {
        console.error("Error getting feed: ", error);
      }
    } catch {
      console.log("oops");
    } finally {
      setLoading(false);
    }
  };

  const Fetchdata = async () => {
    try {
      const TaskConAbi = TaskCon.abi;
      const TaskConAddress = TaskCon.networks[11155111].address;

      try {
        const result = await Contract.getfeed();
        // console.log(result);
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

  async function FetchAndProc() {
    await FetchAttemptsData();

    try {
      if (data && attemptsdata) {
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

            console.log("Before ree: ");

            try {
              for (let i = 0; i < Attempts.length; i++) {
                if (
                  Attempts[i].projectId.toString() == project.projectid &&
                  Attempts[i].tasktitle.toString() == task.tasktitle
                ) {
                  Tasks.push({
                    title: task.tasktitle,
                    desc: task.description,
                    isDone: task.isdone,
                    attempt: Attempts[i],
                  });

                  console.log("Attempts: ", Attempts);
                } else {
                  console.log("no");
                }
              }
            } catch (error) {
              console.log("error processing: ", error);
            }
          });
        });
      } else {
      }
    } catch {}
  }
  const MarkAsDone = async (ProjectId: string, taskTitle: string) => {
    const sender = (window as any).ethereum.selectedAddress.toString();
    console.log("Task Title:", taskTitle);
    console.log("Sender:", sender);

    try {
      const tx = await ContractWithSigner.finishtask(1, 1);
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

  const CreateAttempt = async (
    ProjectId: string,
    TaskId: number,
    TaskTitle: string
  ) => {
    const Collaborator = (window as any).ethereum.selectedAddress.toString();

    const PId = parseInt(ProjectId, 10);

    try {
      const tx = await ContractWithSigner.create_attempt(
        PId,
        TaskId,
        TaskTitle,
        Collaborator
      );
    } catch (error) {
      console.log("Error creating attempt: ", error);
    }
  };

  // console.log(typeof(Tasks));

  useEffect(() => {
    Fetchdata();
  }, []);

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div id="1" className="flex justify-center">
          <main
            className="flex flex-col justify-center"
            style={{ maxWidth: "750px", minWidth: "538px" }}
          >
            <Button onClick={FetchAttemptsData}> get attempts</Button>
            <Button onClick={FetchAndProc}>Fetch and proc</Button>
            {data.map((project: Project, index: number) => (
              <Card
                onClick={() => alert("hello")}
                id="1"
                key={index}
                style={{ marginBottom: "20px", padding: "5px" }}
              >
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription>
                    re
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {project.tasks.map((task: Task, taskIndex: number) => (
                    <div key={taskIndex}>
                      <span>{task.tasktitle}</span>
                      {task.isdone ? (
                        <Badge>Done</Badge>
                      ) : (
                        <>
                          <Badge>Not done</Badge>
                          <Button
                            onClick={() =>
                              MarkAsDone(
                                project.projectid,
                                taskIndex.toString()
                              )
                            }
                          >
                            Mark as done
                          </Button>
                          <Button
                            onClick={() =>
                              CreateAttempt(
                                project.projectid,
                                taskIndex,
                                task.tasktitle
                              )
                            }
                          >
                            Attempt
                          </Button>
                        </>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </main>
        </div>
      )}
    </>
  );
};
// const [data,setdata]
export default Feed;
