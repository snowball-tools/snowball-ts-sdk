import type { Address } from "viem";
import type { Chain, SmartWalletProviderInfo } from "../../helpers";
import type { SnowballSmartWalletProvider } from "./types";
export declare class FunSmartWallet implements SnowballSmartWalletProvider {
    chain: Chain;
    smartWalletProviderInfo: SmartWalletProviderInfo;
    constructor(chain: Chain, smartWalletProviderInfo: SmartWalletProviderInfo);
    sendUserOperation(_targetAddress: Address, _data: Address, _sponsorGas: Boolean): Promise<{
        hash: string;
    }>;
    changeChain(_chain: Chain): void;
}
