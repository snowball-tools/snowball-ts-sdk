import { UserOperationReceipt, UserOperationResponse, type Address, type SimpleSmartAccountOwner } from "@alchemy/aa-core";
import type { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import { Chain } from "../helpers";
import { Hash, Hex } from "viem";
import { Auth } from "../auth";
import { SmartWalletProviderInfo } from "./types";
export declare abstract class SmartWallet {
    ethersWallet: PKPEthersWallet | undefined;
    auth: Auth;
    private _simpleAccountOwner;
    address: Address | undefined;
    smartWalletProviderInfo: SmartWalletProviderInfo;
    constructor(auth: Auth, smartWalletProviderInfo: SmartWalletProviderInfo);
    getSimpleAccountOwner(): Promise<SimpleSmartAccountOwner>;
    get chain(): Chain;
    abstract getAddress(): Promise<Address>;
    abstract switchChain(): Promise<void>;
    abstract sendUserOperation(targetAddress: Address, data: Hex, sponsorGas: Boolean): Promise<{
        hash: string;
    }>;
    abstract waitForUserOperationTransaction(hash: Hash): Promise<Hash>;
    abstract getUserOperationByHash(hash: Hash): Promise<UserOperationResponse>;
    abstract getUserOperationReceipt(hash: Hash): Promise<UserOperationReceipt>;
}
