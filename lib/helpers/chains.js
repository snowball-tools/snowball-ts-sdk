"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAlchemyChain = exports.getAlchemyNetwork = exports.viemChain = exports.CHAINS = void 0;
const chains_1 = require("viem/chains");
const alchemy_sdk_1 = require("alchemy-sdk");
const aa_core_1 = require("@alchemy/aa-core");
exports.CHAINS = {
    ethereum: {
        chainId: 1,
        name: "Ethereum",
        symbol: "ETH",
        decimals: 18,
        type: "ERC1155",
        enabled: false,
        rpcUrls: ["https://eth-mainnet.alchemyapi.io/v2/"],
        blockExplorerUrls: ["https://etherscan.io"],
        vmType: "EVM",
        testNetwork: false,
        factoryAddress: "0x3c752E964f94A6e45c9547e86C70D3d9b86D3b17",
        entryPointAddress: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
    },
    goerli: {
        chainId: 5,
        name: "Goerli",
        symbol: "ETH",
        decimals: 18,
        rpcUrls: ["https://eth-goerli.g.alchemy.com/v2/"],
        blockExplorerUrls: ["https://goerli.etherscan.io"],
        type: "ERC1155",
        enabled: true,
        vmType: "EVM",
        testNetwork: true,
        factoryAddress: "0x3c752E964f94A6e45c9547e86C70D3d9b86D3b17",
        entryPointAddress: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
    },
    sepolia: {
        chainId: 11155111,
        name: "Sepolia",
        symbol: "ETH",
        decimals: 18,
        rpcUrls: ["https://eth-sepolia.g.alchemy.com/v2/"],
        blockExplorerUrls: ["https://sepolia.etherscan.io"],
        type: "ERC1155",
        enabled: true,
        vmType: "EVM",
        testNetwork: true,
        factoryAddress: "0x3c752E964f94A6e45c9547e86C70D3d9b86D3b17",
        entryPointAddress: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
    },
    mantle: {
        chainId: 5000,
        name: "Mantle",
        symbol: "MNT",
        decimals: 18,
        type: "ERC1155",
        enabled: false,
        rpcUrls: ["https://explorer.mantle.xyz/api/eth-rpc"],
        blockExplorerUrls: ["https://explorer.mantle.xyz/"],
        vmType: "EVM",
        testNetwork: false,
        factoryAddress: "0x3c752E964f94A6e45c9547e86C70D3d9b86D3b17",
        entryPointAddress: "0x3c752E964f94A6e45c9547e86C70D3d9b86D3b17",
    },
    mantle_testnet: {
        chainId: 5001,
        name: "Mantle Testnet",
        symbol: "MNT",
        decimals: 18,
        type: "ERC1155",
        enabled: false,
        rpcUrls: [
            "https://rpc.ankr.com/mantle_testnet/1a2aec0bfde1e926c21f0f91e0c90d35ec85093c8bbb9435137067b0f6e36056",
        ],
        blockExplorerUrls: ["https://explorer.testnet.mantle.xyz/"],
        vmType: "EVM",
        testNetwork: true,
        factoryAddress: "0x3c752E964f94A6e45c9547e86C70D3d9b86D3b17",
        entryPointAddress: "0x3c752E964f94A6e45c9547e86C70D3d9b86D3b17",
    },
    polygon: {
        chainId: 137,
        name: "Polygon",
        symbol: "MATIC",
        decimals: 18,
        rpcUrls: ["https://polygon-rpc.com"],
        blockExplorerUrls: ["https://explorer.matic.network"],
        type: "ERC1155",
        enabled: false,
        vmType: "EVM",
        testNetwork: false,
        factoryAddress: "0x3c752E964f94A6e45c9547e86C70D3d9b86D3b17",
        entryPointAddress: "0x3c752E964f94A6e45c9547e86C70D3d9b86D3b17",
    },
    mumbai: {
        chainId: 80001,
        name: "Mumbai",
        symbol: "MATIC",
        decimals: 18,
        rpcUrls: ["https://rpc-mumbai.maticvigil.com/v1/"],
        blockExplorerUrls: ["https://mumbai.polygonscan.com"],
        type: "ERC1155",
        enabled: false,
        vmType: "EVM",
        testNetwork: true,
        factoryAddress: "0x3c752E964f94A6e45c9547e86C70D3d9b86D3b17",
        entryPointAddress: "0x3c752E964f94A6e45c9547e86C70D3d9b86D3b17",
    },
    arbitrum: {
        chainId: 42161,
        name: "Arbitrum",
        symbol: "AETH",
        decimals: 18,
        type: "ERC1155",
        enabled: false,
        rpcUrls: ["https://arb1.arbitrum.io/rpc"],
        blockExplorerUrls: ["https://arbiscan.io/"],
        vmType: "EVM",
        testNetwork: false,
        factoryAddress: "0x3c752E964f94A6e45c9547e86C70D3d9b86D3b17",
        entryPointAddress: "0x3c752E964f94A6e45c9547e86C70D3d9b86D3b17",
    },
    optimism: {
        chainId: 10,
        name: "Optimism",
        symbol: "ETH",
        decimals: 18,
        rpcUrls: ["https://mainnet.optimism.io"],
        blockExplorerUrls: ["https://optimistic.etherscan.io"],
        type: "ERC1155",
        enabled: false,
        vmType: "EVM",
        testNetwork: false,
        factoryAddress: "0x3c752E964f94A6e45c9547e86C70D3d9b86D3b17",
        entryPointAddress: "0x3c752E964f94A6e45c9547e86C70D3d9b86D3b17",
    },
    celo: {
        chainId: 42220,
        name: "Celo",
        symbol: "CELO",
        decimals: 18,
        rpcUrls: ["https://forno.celo.org"],
        blockExplorerUrls: ["https://explorer.celo.org"],
        type: "ERC1155",
        enabled: false,
        vmType: "EVM",
        testNetwork: false,
        factoryAddress: "0x3c752E964f94A6e45c9547e86C70D3d9b86D3b17",
        entryPointAddress: "0x3c752E964f94A6e45c9547e86C70D3d9b86D3b17",
    },
    base: {
        chainId: 8453,
        name: "Base",
        symbol: "ETH",
        decimals: 18,
        rpcUrls: ["https://base-mainnet.g.alchemy.com/v2/"],
        blockExplorerUrls: ["https://basescan.org"],
        type: "ERC1155",
        enabled: true,
        vmType: "EVM",
        testNetwork: false,
        factoryAddress: "0x74fcF00553D3699d845B616D5A9BF5256C984299",
        entryPointAddress: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
    },
    base_goerli: {
        chainId: 84531,
        name: "Base Goerli",
        symbol: "ETH",
        decimals: 18,
        rpcUrls: ["https://base-goerli.g.alchemy.com/v2/"],
        blockExplorerUrls: ["https://goerli.basescan.org"],
        type: "ERC1155",
        enabled: true,
        vmType: "EVM",
        testNetwork: true,
        factoryAddress: "0x74fcF00553D3699d845B616D5A9BF5256C984299",
        entryPointAddress: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
    },
};
function viemChain(chain) {
    switch (chain) {
        case exports.CHAINS.ethereum:
            return chains_1.mainnet;
        case exports.CHAINS.goerli:
            return chains_1.goerli;
        case exports.CHAINS.sepolia:
            return chains_1.sepolia;
        default:
            throw new Error("Unsupported chain");
    }
}
exports.viemChain = viemChain;
function getAlchemyNetwork(chain) {
    switch (chain) {
        case exports.CHAINS.ethereum:
            return alchemy_sdk_1.Network.ETH_MAINNET;
        case exports.CHAINS.goerli:
            return alchemy_sdk_1.Network.ETH_GOERLI;
        case exports.CHAINS.sepolia:
            return alchemy_sdk_1.Network.ETH_SEPOLIA;
        default:
            throw new Error("Unsupported chain");
    }
}
exports.getAlchemyNetwork = getAlchemyNetwork;
function getAlchemyChain(chain) {
    switch (chain) {
        case exports.CHAINS.ethereum:
            return aa_core_1.chains.mainnet;
        case exports.CHAINS.goerli:
            return aa_core_1.chains.goerli;
        case exports.CHAINS.sepolia:
            return aa_core_1.chains.sepolia;
        default:
            throw new Error("Unsupported chain");
    }
}
exports.getAlchemyChain = getAlchemyChain;
