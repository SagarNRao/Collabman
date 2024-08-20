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

interface Attempt {
  projectId: number;
  taskId: number;
  tasktitle: string;
  collaborator: string;
  status: boolean;
}

const Attempts: React.FC = (): React.ReactNode => {
  const [data, setdata] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const web3 = new Web3(
    "https://sepolia.infura.io/v3/e84a2946755345209aa59f4a1645f14a"
  );

  const provider = new ethers.providers.Web3Provider((window as any).ethereum);

  const Contract = new ethers.Contract(
    TaskCon.networks[11155111].address,
    TaskCon.abi,
    provider
  );

  const FetchAttemptsData = async () => {
    try {
      const TaskConAbi = TaskCon.abi;
      const TaskConAddress = TaskCon.networks[11155111].address;

      try {
        const result = await Contract.getattempts();
        console.log(result);
        let parsedData;
        if (data) {
          for (let i = 0; i < data.length; i++) {
            parsedData = JSON.parse(data);
          }
        }
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

  return (
    <>
      <Button onClick={FetchAttemptsData}>See attempts</Button>
      <p>{data}</p>
    </>
  );
};

export default Attempts;
