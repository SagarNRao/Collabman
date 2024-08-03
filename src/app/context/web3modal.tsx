"use client";

import { createWeb3Modal, defaultConfig } from "@web3modal/ethers5/react";

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = "e716a69c7e2e023e9484c136f6a1a079";

// 2. Set chains
const sepoliaTestnet = {
  chainId: 12345,
  name: "Sepolia Testnet",
  currency: "SEP",
  explorerUrl: "https://sepolia-explorer.com",
  rpcUrl: "https://sepolia-rpc.com",
};

// 3. Create a metadata object
const metadata = {
  name: "My Website",
  description: "My Website description",
  url: "http://localhost:3000", // origin must match your domain & subdomain
  icons: ["https://avatars.mywebsite.com/"],
};

// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,

  /*Optional*/
  enableEIP6963: true, // true by default
  enableInjected: true, // true by default
  enableCoinbase: true, // true by default
  rpcUrl: "...", // used for the Coinbase SDK
  defaultChainId: 1, // used for the Coinbase SDK
});

// 5. Create a Web3Modal instance
createWeb3Modal({
  ethersConfig,
  chains: [sepoliaTestnet],
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
});

import { ReactNode } from 'react';

export function Web3Modal({ children }: { children: ReactNode }) {
  return children;
}
