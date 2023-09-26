import type { Address } from "viem";
import type { Chain, SmartWalletProviderInfo } from "../../helpers";
export interface SnowballSmartWalletProvider {
    chain: Chain;
    smartWalletProviderInfo: SmartWalletProviderInfo;
    sendUserOperation(targetAddress: Address, data: Address, sponsorGas: Boolean): Promise<{
        hash: string;
    }>;
}
//# sourceMappingURL=SnowballSmartWalletProvider.d.ts.map