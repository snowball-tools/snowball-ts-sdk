import type { Address } from "viem";
import type { Chain, SmartWalletProviderInfo } from "../../helpers";
import type { SnowballSmartWalletProvider } from "./types";
import { UserOperationResponse, UserOperationReceipt } from "@alchemy/aa-core";
export declare class FunSmartWallet implements SnowballSmartWalletProvider {
    chain: Chain;
    smartWalletProviderInfo: SmartWalletProviderInfo;
    constructor(chain: Chain, smartWalletProviderInfo: SmartWalletProviderInfo);
    sendUserOperation(_targetAddress: Address, _data: Address, _sponsorGas: Boolean): Promise<{
        hash: string;
    }>;
    changeChain(_chain: Chain): void;
    waitForUserOperationTransaction(_hash: `0x${string}`): Promise<`0x${string}`>;
    getUserOperationByHash(_hash: `0x${string}`): Promise<UserOperationResponse>;
    getUserOperationReceipt(_hash: `0x${string}`): Promise<UserOperationReceipt>;
}
