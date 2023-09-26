import type { Address, Hex } from "@alchemy/aa-core";
import type { Chain } from "../helpers/chains";
import { type SmartWalletProviderInfo, type AuthProviderInfo } from "../helpers/constants";
import type { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
export interface SnowballAuth {
    authProviderInfo: AuthProviderInfo;
    chain: Chain;
    isWebAuthnSupported(): boolean;
    register(username: string): Promise<void>;
    authenticate(): Promise<void>;
    getEthersWallet(): Promise<PKPEthersWallet>;
}
export interface SnowballSmartWallet {
    smartWalletProviderInfo: SmartWalletProviderInfo;
    auth: SnowballAuth;
    getAddress(): Promise<Address>;
    sendUserOperation(targetAddress: Address, data: Hex, sponsorGas: Boolean): Promise<{
        hash: string;
    }>;
}
export declare class Snowball {
    private chain;
    private authProviderInfo;
    private smartWalletProviderInfo;
    auth: SnowballAuth;
    smartWallet: SnowballSmartWallet | undefined;
    ethersWallet: PKPEthersWallet | undefined;
    constructor(_apiKey: string, chain: Chain, authProviderInfo: AuthProviderInfo, smartWalletProviderInfo: SmartWalletProviderInfo);
    getEthersWallet(): Promise<PKPEthersWallet>;
    changeChain(chain: Chain): Promise<void>;
    getAddress(): Promise<Address>;
    sendUserOperation(targetAddress: Address, data: Hex, sponsorGas: Boolean): Promise<{
        hash: string;
    }>;
}
