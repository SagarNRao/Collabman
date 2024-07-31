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
import AddProject from "@/actions/addproject";
import Feed from "@/actions/feed";
import ReadContract from "./../actions/read"

const client = new QueryClient();

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <>
      <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <div style={{ width: "1200px" }}></div>
            </NavigationMenuItem>
            <NavigationMenuItem className="flex">
              <w3m-button />
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      <main className="flex justify-center items-center h-screen">
        {isClient && <AddProject web3={new Web3()} account={""} />}
      </main>
      <ReadContract/>
    </>
  );
}
