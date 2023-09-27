import type { Address, Hex, UserOperationReceipt, UserOperationResponse } from "@alchemy/aa-core";
import type { Chain } from "../helpers/chains";
import { type SmartWalletProviderInfo, type AuthProviderInfo } from "../helpers/constants";
import type { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import type { SnowballAuth, SnowballSmartWallet } from "./types";
import { Hash } from "viem";
export declare class Snowball {
    private apiKey;
    private chain;
    private authProviderInfo;
    private smartWalletProviderInfo;
    auth: SnowballAuth;
    smartWallet: SnowballSmartWallet | undefined;
    ethersWallet: PKPEthersWallet | undefined;
    constructor(apiKey: string, chain: Chain, authProviderInfo: AuthProviderInfo, smartWalletProviderInfo: SmartWalletProviderInfo);
    register(username: string): Promise<void>;
    authenticate(): Promise<void>;
    getEthersWallet(): Promise<PKPEthersWallet>;
    changeChain(chain: Chain): Promise<undefined>;
    getAddress(): Promise<Address>;
    private initSmartWallet;
    sendUserOperation(targetAddress: Address, data: Hex, sponsorGas: Boolean): Promise<{
        hash: string;
    }>;
    waitForUserOperationTransaction(hash: Hash): Promise<Hash>;
    getUserOperationByHash(hash: Hash): Promise<UserOperationResponse>;
    getUserOperationReceipt(hash: Hash): Promise<UserOperationReceipt>;
}
//# sourceMappingURL=Snowball.d.ts.map