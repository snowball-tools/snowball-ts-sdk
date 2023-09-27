import { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import { AuthProviderInfo, Chain, SmartWalletProviderInfo } from "../helpers";
import { Address, Hash, Hex } from "viem";
import { UserOperationReceipt, UserOperationResponse } from "@alchemy/aa-core";
export interface SnowballAuth {
    authProviderInfo: AuthProviderInfo;
    readonly chain: Chain;
    register(username: string): Promise<void>;
    authenticate(): Promise<void>;
    getEthersWallet(): Promise<PKPEthersWallet>;
    changeChain(chain: Chain): void;
}
export interface SnowballSmartWallet {
    smartWalletProviderInfo: SmartWalletProviderInfo;
    auth: SnowballAuth;
    getAddress(): Promise<Address>;
    changeChain(): Promise<void>;
    sendUserOperation(targetAddress: Address, data: Hex, sponsorGas: Boolean): Promise<{
        hash: string;
    }>;
    waitForUserOperationTransaction(hash: Hash): Promise<Hash>;
    getUserOperationByHash(hash: Hash): Promise<UserOperationResponse>;
    getUserOperationReceipt(hash: Hash): Promise<UserOperationReceipt>;
}
