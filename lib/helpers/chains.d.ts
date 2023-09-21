import type { Address } from "viem";
import { type Chain as ViemChain } from "viem/chains";
import { Network } from "alchemy-sdk";
export interface Chain {
    chainId: number;
    name: string;
    symbol: string;
    decimals: number;
    type: string;
    enabled: boolean;
    rpcUrls: string[];
    blockExplorerUrls: string[];
    vmType: string;
    testNetwork: boolean;
    factoryAddress: Address;
    entryPointAddress: Address;
}
export declare const CHAINS: {
    ethereum: {
        chainId: number;
        name: string;
        symbol: string;
        decimals: number;
        type: string;
        enabled: boolean;
        rpcUrls: string[];
        blockExplorerUrls: string[];
        vmType: string;
        testNetwork: boolean;
        factoryAddress: `0x${string}`;
        entryPointAddress: `0x${string}`;
    };
    goerli: {
        chainId: number;
        name: string;
        symbol: string;
        decimals: number;
        rpcUrls: string[];
        blockExplorerUrls: string[];
        type: string;
        enabled: boolean;
        vmType: string;
        testNetwork: boolean;
        factoryAddress: `0x${string}`;
        entryPointAddress: `0x${string}`;
    };
    sepolia: {
        chainId: number;
        name: string;
        symbol: string;
        decimals: number;
        rpcUrls: string[];
        blockExplorerUrls: string[];
        type: string;
        enabled: boolean;
        vmType: string;
        testNetwork: boolean;
        factoryAddress: `0x${string}`;
        entryPointAddress: `0x${string}`;
    };
    mantle: {
        chainId: number;
        name: string;
        symbol: string;
        decimals: number;
        type: string;
        enabled: boolean;
        rpcUrls: string[];
        blockExplorerUrls: string[];
        vmType: string;
        testNetwork: boolean;
        factoryAddress: `0x${string}`;
        entryPointAddress: `0x${string}`;
    };
    mantle_testnet: {
        chainId: number;
        name: string;
        symbol: string;
        decimals: number;
        type: string;
        enabled: boolean;
        rpcUrls: string[];
        blockExplorerUrls: string[];
        vmType: string;
        testNetwork: boolean;
        factoryAddress: `0x${string}`;
        entryPointAddress: `0x${string}`;
    };
    polygon: {
        chainId: number;
        name: string;
        symbol: string;
        decimals: number;
        rpcUrls: string[];
        blockExplorerUrls: string[];
        type: string;
        enabled: boolean;
        vmType: string;
        testNetwork: boolean;
        factoryAddress: `0x${string}`;
        entryPointAddress: `0x${string}`;
    };
    mumbai: {
        chainId: number;
        name: string;
        symbol: string;
        decimals: number;
        rpcUrls: string[];
        blockExplorerUrls: string[];
        type: string;
        enabled: boolean;
        vmType: string;
        testNetwork: boolean;
        factoryAddress: `0x${string}`;
        entryPointAddress: `0x${string}`;
    };
    arbitrum: {
        chainId: number;
        name: string;
        symbol: string;
        decimals: number;
        type: string;
        enabled: boolean;
        rpcUrls: string[];
        blockExplorerUrls: string[];
        vmType: string;
        testNetwork: boolean;
        factoryAddress: `0x${string}`;
        entryPointAddress: `0x${string}`;
    };
    optimism: {
        chainId: number;
        name: string;
        symbol: string;
        decimals: number;
        rpcUrls: string[];
        blockExplorerUrls: string[];
        type: string;
        enabled: boolean;
        vmType: string;
        testNetwork: boolean;
        factoryAddress: `0x${string}`;
        entryPointAddress: `0x${string}`;
    };
    celo: {
        chainId: number;
        name: string;
        symbol: string;
        decimals: number;
        rpcUrls: string[];
        blockExplorerUrls: string[];
        type: string;
        enabled: boolean;
        vmType: string;
        testNetwork: boolean;
        factoryAddress: `0x${string}`;
        entryPointAddress: `0x${string}`;
    };
};
export declare const DEFAULT_CHAIN: {
    chainId: number;
    name: string;
    symbol: string;
    decimals: number;
    rpcUrls: string[];
    blockExplorerUrls: string[];
    type: string;
    enabled: boolean;
    vmType: string;
    testNetwork: boolean;
    factoryAddress: `0x${string}`;
    entryPointAddress: `0x${string}`;
};
export declare function viemChain(chain: Chain): ViemChain;
export declare function getAlchemyNetwork(chain: Chain): Network;
