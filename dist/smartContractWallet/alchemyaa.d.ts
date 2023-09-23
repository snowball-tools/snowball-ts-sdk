import { type Address, type SendUserOperationResult, type Hex, type SimpleSmartAccountOwner } from "@alchemy/aa-core";
import type { SnowballAuth } from "../main/Snowball";
import { SmartContractWallet } from "./SmartContractWallet";
import type { AAProvider } from "../helpers/constants";
export declare class AlchemyAA extends SmartContractWallet {
    private gasPolicyId;
    constructor(auth: SnowballAuth, simpleAccountOwner: SimpleSmartAccountOwner, aaProvider: AAProvider);
    sendUserOp(targetAddress: Address, data: Hex, sponsorGas: Boolean): Promise<SendUserOperationResult>;
}
