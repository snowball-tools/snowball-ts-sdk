import { type Address, type SendUserOperationResult, type Hex, type SimpleSmartAccountOwner } from "@alchemy/aa-core";
import { type Chain } from "../../helpers/chains";
import type { SmartWalletProviderInfo } from "../../helpers/constants";
import type { SnowballSmartWalletProvider } from "./SnowballSmartWalletProvider";
export declare class AlchemySmartWallet implements SnowballSmartWalletProvider {
    private gasPolicyId;
    private provider;
    chain: Chain;
    smartWalletProviderInfo: SmartWalletProviderInfo;
    constructor(simpleAccountOwner: SimpleSmartAccountOwner, smartWalletProviderInfo: SmartWalletProviderInfo, chain: Chain);
    sendUserOperation(targetAddress: Address, data: Hex, sponsorGas: Boolean): Promise<SendUserOperationResult>;
}
