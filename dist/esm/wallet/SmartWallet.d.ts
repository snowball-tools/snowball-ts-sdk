import { type Address, type SimpleSmartAccountOwner } from "@alchemy/aa-core";
import type { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import type { SnowballAuth, SnowballSmartWallet } from "../snowball";
import { type SmartWalletProviderInfo } from "../helpers";
import type { SnowballSmartWalletProvider } from "./providers/types";
export declare class SmartWallet implements SnowballSmartWallet {
    smartWalletProvider: SnowballSmartWalletProvider | undefined;
    ethersWallet: PKPEthersWallet;
    auth: SnowballAuth;
    simpleAccountOwner: SimpleSmartAccountOwner | undefined;
    address: Address | undefined;
    smartWalletProviderInfo: SmartWalletProviderInfo;
    constructor(ethersWallet: PKPEthersWallet, auth: SnowballAuth, smartWalletProviderInfo: SmartWalletProviderInfo);
    getSimpleAccountOwner(): Promise<SimpleSmartAccountOwner>;
    getAddress(): Promise<Address>;
    changeChain(ethersWallet: PKPEthersWallet): Promise<void>;
    sendUserOperation(targetAddress: Address, data: Address, sponsorGas: Boolean): Promise<{
        hash: string;
    }>;
    initSmartWalletProvider(): Promise<SnowballSmartWalletProvider>;
}
