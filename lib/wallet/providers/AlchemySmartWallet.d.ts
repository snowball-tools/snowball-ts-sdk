import { type Address, type SendUserOperationResult, type Hex, type SimpleSmartAccountOwner, UserOperationResponse, UserOperationReceipt } from "@alchemy/aa-core";
import type { SmartWalletProviderInfo } from "../../helpers/constants";
import type { SnowballSmartWalletProvider } from "./types";
import { Chain } from "../../helpers";
export declare class AlchemySmartWallet implements SnowballSmartWalletProvider {
    private provider;
    chain: Chain;
    smartWalletProviderInfo: SmartWalletProviderInfo;
    simpleAccountOwner: SimpleSmartAccountOwner;
    constructor(simpleAccountOwner: SimpleSmartAccountOwner, smartWalletProviderInfo: SmartWalletProviderInfo, chain: Chain);
    changeChain(chain: Chain): void;
    sendUserOperation(targetAddress: Address, data: Hex, sponsorGas: Boolean): Promise<SendUserOperationResult>;
    private initAlchemyProvider;
    waitForUserOperationTransaction(hash: `0x${string}`): Promise<`0x${string}`>;
    getUserOperationByHash(hash: `0x${string}`): Promise<UserOperationResponse>;
    getUserOperationReceipt(hash: `0x${string}`): Promise<UserOperationReceipt>;
}