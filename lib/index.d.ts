import { SimpleSmartAccountOwner, Address, Hex } from "@alchemy/aa-core";
import { Chain } from "./helpers/chains";
export interface SnowballAuth {
    chain: Chain;
    registerPasskey(username: string): Promise<Boolean>;
    authenticatePasskey(): Promise<Boolean>;
    getSimpleAccountOwner(chain: Chain): Promise<SimpleSmartAccountOwner>;
}
export interface SnowballSmartWallet {
    getSmartWalletAddress(): Promise<Address>;
    sendUserOperation(gasPolicyId: string, targetAddress: Address, data: Hex): Promise<Boolean>;
}
