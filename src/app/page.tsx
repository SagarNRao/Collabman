"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import logo from "../../public/logo.png";
import Image from "next/image";
import Web3 from "Web3";
import "./globals.css";
// import "@rainbow-me/rainbowkit/styles.css";
import React from "react";
import { useState, useEffect } from "react";
import { QueryClient } from "@tanstack/react-query";
// import AddProject from "@/actions/addproject";
import ProjectForm from "@/actions/addproject";
import Feed from "@/actions/feed";
import EditProjectTitle from "@/actions/edittitle";
import ReadContract from "@/actions/read";
import { ethers } from "ethers";
import TaskCon from "../../artifacts-zk/contracts/TaskCon.sol/TaskCon.json";
import BoxReveal from "@/components/magicui/box-reveal";
import Meteors from "@/components/magicui/meteors";

const web3 = new Web3(
  "https://sepolia.infura.io/v3/e84a2946755345209aa59f4a1645f14a"
);

if (!(window as any).ethereum) {
  alert("Please install MetaMask");
}
const provider = new ethers.providers.Web3Provider((window as any).ethereum);
provider.send("eth_requestAccounts", []);
const signer = provider.getSigner();
const contract = new ethers.Contract(
  TaskCon.networks[11155111].address,
  TaskCon.abi,
  signer
);

const client = new QueryClient();

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <>
      <div className="flex">
        <BoxReveal boxColor={"#5046e6"} duration={0.5}>
          <p className="text-[3.5rem] font-semibold">
            Hello there<span className="text-[#5046e6]">.</span>
          </p>
        </BoxReveal>
        <div style={{ width: "900px" }}></div>
        <w3m-button />
      </div>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <div style={{ width: "1200px" }}></div>
          </NavigationMenuItem>
          <NavigationMenuItem></NavigationMenuItem>
          <NavigationMenuItem className="flex"></NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <main className="flex justify-center items-center h-screen">
        {isClient && <ProjectForm contractInstance={contract} account={""} />}
      </main>
      <Feed />
      {/* <EditProjectTitle/> */}
    </>
  );
}
