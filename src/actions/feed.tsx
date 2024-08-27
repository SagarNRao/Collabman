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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface Project {
  title: string;
  description: string;
  url: string;
  tasks: Task[];
  projectid: string;
  ownerman: string;
}

interface Task {
  tasktitle: string;
  description: string;
  isdone: boolean;
  ownerman: string;
  attempt: Attempt[];
}

interface Attempt {
  projectid: string;
  taskid: string;
  tasktitle: string;
  collaborator: string;
  status: boolean;
}

export const ProjectIds: string[] = [];
export const ProjectTitles: string[] = [];
export const ProjectDescs: string[] = [];
export const Urls: string[] = [];
// const Tasks: { title: string; desc: string; isDone: boolean }[] = [];
export const Tasks: {
  title: string;
  desc: string;
  isDone: boolean;
  attempt: Attempt[];
}[] = [];
export const TaskTitle: string[] = [];
export const TaskDesc: string[] = [];
export const TaskStatus: boolean[] = [];
export const Attempts: Attempt[] = [];

let Counter: number = ProjectTitles.length + 1;
console.log(Counter);

const Feed = () => {
  const [data, setdata] = useState<any>(null);
  const [attemptsdata, setattemptsdata] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedAttempts, setSelectedAttempts] = useState<Attempt[] | null>(
    null
  );

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
        console.log("parsed data: ", parsedData);
        parsedData.forEach((attempt: Attempt) => {
          Attempts.push({
            projectid: attempt.projectid,
            taskid: attempt.taskid,
            tasktitle: attempt.tasktitle,
            collaborator: attempt.collaborator,
            status: attempt.status,
          });
        });
        setattemptsdata(parsedData);
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

        const balance = await Contract.getContractBalance();
        console.log(balance);
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

            if (!Attempts) {
              console.log("Attempts is empty");
            } else {
              console.log("Ye");
            }

            try {
              for (let i = 0; i < Attempts.length; i++) {
                if (!Attempts[i].projectid) {
                  console.log("empty projectid");
                } else if (!Attempts[i].tasktitle) {
                  console.log("empty tasktitle");
                } else {
                  console.log("ye");
                }

                const matchingAttempts = Attempts.filter(
                  (attempt) =>
                    attempt.projectid.toString() === project.projectid &&
                    attempt.tasktitle.toString() === task.tasktitle
                );

                if (matchingAttempts.length > 0) {
                  Tasks.push({
                    title: task.tasktitle,
                    desc: task.description,
                    isDone: task.isdone,
                    attempt: matchingAttempts, // Assign the array of matching attempts
                  });

                  console.log("Tasks: ", Tasks);
                } else {
                  console.log("Processing failed");
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

  const MarkAsDone = async (ProjectId: string, TaskId: string) => {
    const sender = (window as any).ethereum.selectedAddress.toString();
    console.log("Sender:", sender);

    const PId = parseInt(ProjectId);
    let TId = parseInt(TaskId);
    console.log("Task Id before increment attempt:", TaskId);
    TId++;
    console.log("Task Id:", TaskId);

    // const

    try {
      const tx = await ContractWithSigner.finishtask(PId, TId, sender);
      console.log(tx);
      console.log(tx.receipt);
      console.log(tx.data);
    } catch (error) {
      console.log("error:", error);
    }
  };

  const CreateAttempt = async (
    ProjectId: string,
    TaskId: string,
    TaskTitle: string
  ) => {
    const Collaborator = (window as any).ethereum.selectedAddress.toString();

    const PId = parseInt(ProjectId, 10);
    const TId = parseInt(TaskId, 10);

    try {
      const tx = await ContractWithSigner.create_attempt(
        PId,
        TId,
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

  const handleSheetTriggerClick = (attempts: Attempt[]) => {
    setSelectedAttempts(attempts);
  };

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
            {/* {data.map((project: Project, index: number) => (
              <Card
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
                                taskIndex.toString(),
                                task.tasktitle
                              )
                            }
                          >
                            Attempt
                          </Button>
                          <Sheet>
                            <SheetTrigger asChild>
                              <Button variant="outline">Open</Button>
                            </SheetTrigger>
                            <SheetContent>
                              {attemptsdata
                                .filter(
                                  (attempt) =>
                                    attempt.projectid === project.projectid &&
                                    attempt.taskid === taskIndex.toString()
                                )
                                .map(
                                  (attempt: Attempt, attemptIndex: number) => (
                                    <span key={attemptIndex}>
                                      {attempt.collaborator}
                                    </span>
                                  )
                                )}
                            </SheetContent>
                          </Sheet>
                        </>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))} */}

            {data.map((project: Project, index: number) => (
              <Card
                id="1"
                key={index}
                style={{ marginBottom: "20px", padding: "5px" }}
              >
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
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
                              CreateAttempt(
                                project.projectid,
                                taskIndex.toString(),
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
                <CardFooter>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline">View Attempts</Button>
                    </SheetTrigger>
                    <SheetContent>
                      {attemptsdata
                        .filter(
                          (attempt) => attempt.projectid === project.projectid
                        )
                        .map((attempt: Attempt, attemptIndex: number) => (
                          <span key={attemptIndex}>
                            {attempt.tasktitle}: {attempt.collaborator}{" "}
                            {attempt.status ? (
                              <Badge>Done</Badge>
                            ) : (
                              <>
                                <Badge>In Progress</Badge>
                                <Button
                                  onClick={() =>
                                    MarkAsDone(
                                      attempt.projectid,
                                      attempt.taskid
                                    )
                                  }
                                >
                                  Mark as done
                                </Button>
                              </>
                            )}
                          </span>
                        ))}
                      {"\n"}
                    </SheetContent>
                  </Sheet>
                </CardFooter>
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
