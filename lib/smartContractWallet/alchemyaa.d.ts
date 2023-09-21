import type { Address, SendUserOperationResult, Hex } from "@alchemy/aa-core";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import type { SnowballAuth, SnowballSmartWallet } from "../snowball";
export declare class AlchemyAA extends AlchemyProvider implements SnowballSmartWallet {
    auth: SnowballAuth;
    private gasPolicyId;
    constructor(auth: SnowballAuth, apiKey: string, gasPolicyId: string | undefined);
    sendUserOp(targetAddress: Address, data: Hex, sponsorGas: Boolean): Promise<SendUserOperationResult>;
}
