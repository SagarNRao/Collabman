"use client";

import React from "react";
import TaskCon from "../../artifacts-zk/contracts/TaskCon.sol/TaskCon.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Web3 from "Web3";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
// import { Table } from "@/components/ui/table";

interface NewProjectProps {
  web3: Web3;
  account: string;
}

const AddProject: React.FC<NewProjectProps> = ({web3, account}) => {
  const [postTitle, setPostTitle] = useState<string>("");
  const [postDesc, setPostDesc] = useState<string>("");
  const [postUrl, setpostUrl] = useState<string>("");
  const [postTaskArr, setpostTaskArr] = useState<string>("");

  const handlesubmit = async (e: React.FormEvent) => {
    const tasks = postTaskArr.split("\n").filter((task) => task.trim() !== "");
    e.preventDefault();
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
      console.log("using account: ", account);

      // Wrap the existing web3 provider with Web3Provider

      const signerAddress = await signer.getAddress();

      const title = postTitle;
      const desc = postDesc;
      //   const tx = await contract.addProject(postTitle, postDesc)
    } catch {
      console.log("oops");
    }
  };

  return (
    <div>
      <form onSubmit={handlesubmit}>
        <Textarea
          className="max-w-[300px]"
          value={postTitle}
          onChange={(e) => setPostTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <Textarea
          className="max-w-[300px]"
          value={postDesc}
          onChange={(e) => setPostDesc(e.target.value)}
          placeholder="Description"
          required
        />
        <Textarea
          className="max-w-[300px]"
          value={postUrl}
          onChange={(e) => setpostUrl(e.target.value)}
          placeholder="Url to your repo"
          required
        />
        <Textarea
          className="max-w-[300px]"
          value={postTaskArr}
          onChange={(e) => setpostTaskArr(e.target.value)}
          placeholder="Enter tasks, one per line (will add a better way to make tasks later)"
          required
        />
        <Button type="submit">Submit Post</Button>
      </form>
    </div>
  );
}

export default AddProject;

// function addProject(
//     string memory _title,
//     string memory _description,
//     string memory _url,
//     task[] memory _tasks
// ) public {
//     Counter++; // Increment the project counter

//     project storage newProject = projects.push();
//     newProject.title = _title;
//     newProject.description = _description;
//     newProject.url = _url;
//     newProject.projectid = Strings.uintToString(Counter);

//     for (uint256 i = 0; i < _tasks.length; i++) {
//         task memory newTask = _tasks[i];
//         newProject.tasks.push(newTask);
//     }

//     emit AddProject(msg.sender, Counter);
// }
