"use client";

import Image from "next/image";
import AddProject from "../actions/addproject";
import { WalletConnectButton } from "@/actions/ConnectWalletButton";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import Web3ModalProvider from "./context";
import { useState, useEffect } from "react";
import { QueryClient } from "@tanstack/react-query";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers5/react";


const client = new QueryClient();

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <>
      {/* <w3m-button /> */}
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
        <AddProject />
      </main>
    </>
  );
}
