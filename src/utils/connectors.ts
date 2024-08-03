// connectors.ts
import { InjectedConnector } from '@web3-react/injected-connector';

export const injected = new InjectedConnector({ supportedChainIds: [11155111, 3, 4, 5, 42, 31337] });