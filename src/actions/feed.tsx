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

const Feed: React.FC = () => {
  const [data, setdata] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
// const a = TaskCon.abi;
//   const b = a as const;
  

  const Fetchdata = async () => {
    try {
      const web3 = new Web3("https://sepolia.infura.io/v3/e84a2946755345209aa59f4a1645f14a");

      if (!(window as any).ethereum) {
        alert("Please install MetaMask");
      }
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );

      const Contract = new ethers.Contract(
        TaskCon.networks[11155111].address,
        TaskCon.abi,
        provider
      );

      const TaskConAbi = TaskCon.abi;
      const TaskConAddress = TaskCon.networks[11155111].address;

      try {
        const result = await Contract.getfeed();
        setdata(result);
      } catch (error) {
        console.error("Error getting feed: ", error);
      }
    } catch {
      console.log("oops");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Fetchdata();
  }, []);

  return (
    <>
      <Button onClick={() => console.log(data)}>See what everyone is doing</Button>
      {loading ? <p>Loading...</p> : <pre>{JSON.stringify(data, null, 2)}</pre>}
    </>
  );
};
// const [data,setdata]
export default Feed;
