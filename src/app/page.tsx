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
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react'

// 1. Get a Project ID from https://cloud.walletconnect.com/ 
const projectId = 'e716a69c7e2e023e9484c136f6a1a079'

// 2. Set chains
const celo = {
  chainId: 42220,
  name: 'Celo',
  currency: 'CELO',
  explorerUrl: 'https://explorer.celo.org/mainnet',
  rpcUrl: 'https://forno.celo.org'
}

const alfajores = {
  chainId: 44787,
  name: 'Alfajores',
  currency: 'CELO',
  explorerUrl: 'https://explorer.celo.org/alfajores',
  rpcUrl: 'https://alfajores-forno.celo-testnet.org'
}

// 3. Create modal
const metadata = {
  name: 'My Celo App',
  description: 'My Website description',
  url: 'https://mywebsite.com',
  icons: ['https://avatars.mywebsite.com/']
}

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [celo, alfajores],
  defaultChain: celo,
  projectId
})


const client = new QueryClient();

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <>
      <w3m-button />
      <main className="flex justify-center items-center h-screen">
        <AddProject />
      </main>
    </>
  );
}
