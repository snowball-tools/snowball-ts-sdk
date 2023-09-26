import type { Address } from "viem";
import type { Chain, SmartWalletProviderInfo } from "../../helpers";
import type { SnowballSmartWalletProvider } from "./SnowballSmartWalletProvider";
export declare class FunSmartWallet implements SnowballSmartWalletProvider {
    chain: Chain;
    smartWalletProviderInfo: SmartWalletProviderInfo;
    constructor(chain: Chain, smartWalletProviderInfo: SmartWalletProviderInfo);
    sendUserOperation(_targetAddress: Address, _data: Address, _sponsorGas: Boolean): Promise<{
        hash: string;
    }>;
}
