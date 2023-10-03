import type { Address } from "viem";
import { UserOperationResponse, UserOperationReceipt } from "@alchemy/aa-core";
import { SmartWallet } from "./SmartWallet";
export declare class FunSmartWallet extends SmartWallet {
    sendUserOperation(_targetAddress: Address, _data: Address, _sponsorGas: Boolean): Promise<{
        hash: string;
    }>;
    getAddress(): Promise<`0x${string}`>;
    waitForUserOperationTransaction(_hash: `0x${string}`): Promise<`0x${string}`>;
    getUserOperationByHash(_hash: `0x${string}`): Promise<UserOperationResponse>;
    getUserOperationReceipt(_hash: `0x${string}`): Promise<UserOperationReceipt>;
    switchChain(): Promise<void>;
}
