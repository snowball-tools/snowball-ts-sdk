import type { Address, Hex, UserOperationReceipt, UserOperationResponse } from "@alchemy/aa-core";
import type { Chain } from "../helpers/chains";
import type { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import { Hash } from "viem";
import type { SmartWalletProviderInfo } from "../wallet/types";
import type { AuthProviderInfo } from "../auth/types";
export declare class Snowball {
    private apiKey;
    private chain;
    private authProviderInfo;
    private smartWalletProviderInfo;
    private auth;
    private smartWallet;
    constructor(apiKey: string, chain: Chain, authProviderInfo: AuthProviderInfo, smartWalletProviderInfo: SmartWalletProviderInfo);
    private initAuth;
    private initSmartWallet;
    register(username: string): Promise<void>;
    authenticate(): Promise<void>;
    getEthersWallet(): Promise<PKPEthersWallet>;
    switchChain(chain: Chain): Promise<undefined>;
    getAddress(): Promise<Address>;
    sendUserOperation(targetAddress: Address, data: Hex, sponsorGas: boolean): Promise<{
        hash: string;
    }>;
    waitForUserOperationTransaction(hash: Hash): Promise<Hash>;
    getUserOperationByHash(hash: Hash): Promise<UserOperationResponse>;
    getUserOperationReceipt(hash: Hash): Promise<UserOperationReceipt>;
}
