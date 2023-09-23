import { type SendUserOperationResult, type SimpleSmartAccountOwner } from "@alchemy/aa-core";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import type { Address } from "viem";
import { type SnowballAuth, type SnowballSmartWallet, type AAProvider } from "..";
export declare class SmartContractWallet implements SnowballSmartWallet {
    auth: SnowballAuth;
    provider: AlchemyProvider;
    simpleAccountOwner: SimpleSmartAccountOwner | undefined;
    address: Address | undefined;
    aaProvider: AAProvider;
    constructor(auth: SnowballAuth, simpleAccountOwner: SimpleSmartAccountOwner, aaProvider: AAProvider);
    getAddress(): Promise<Address>;
    sendUserOp(targetAddress: Address, data: Address, sponsorGas: Boolean): Promise<SendUserOperationResult>;
}
