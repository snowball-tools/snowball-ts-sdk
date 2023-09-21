import { SnowballAuth, SnowballSmartWallet } from "..";
import { Address, SendUserOperationResult, Hex } from "@alchemy/aa-core";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
declare class AlchemyAA extends AlchemyProvider implements SnowballSmartWallet {
    auth: SnowballAuth;
    private simpleAccountOwner;
    private address;
    private apiKey;
    private alchemy;
    private gasPolicyId;
    constructor(auth: SnowballAuth, apiKey: string, gasPolicyId: string | undefined);
    sendUserOp(targetAddress: Address, data: Hex, sponsorGas: Boolean): Promise<SendUserOperationResult>;
}
export default AlchemyAA;
