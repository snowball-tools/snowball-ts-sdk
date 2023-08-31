import { SnowballAuth, SnowballSmartWallet } from "..";
import { Address, Hex } from "@alchemy/aa-core";
declare class AlchemyAA implements SnowballSmartWallet {
    private auth;
    private simpleAccountOwner;
    private provider;
    private address;
    private apiKey;
    private alchemy;
    constructor(auth: SnowballAuth, apiKey: string);
    getSmartWalletAddress(): Promise<Address>;
    sendUserOperation(gasPolicyId: string, targetAddress: Address, data: Hex): Promise<Boolean>;
}
export default AlchemyAA;
