import type { SimpleSmartAccountOwner, Address, Hex, SendUserOperationResult } from "@alchemy/aa-core";
import type { Chain } from "../helpers/chains";
import type { AuthMethod } from "@lit-protocol/types";
import { type AuthProvider, type AAProvider } from "../helpers/constants";
export interface SnowballAuth {
    authProvider: AuthProvider;
    chain: Chain;
    registerPasskey(username: string): Promise<void>;
    authenticatePasskey(): Promise<AuthMethod>;
    getSimpleAccountOwner(): Promise<SimpleSmartAccountOwner>;
}
export interface SnowballSmartWallet {
    aaProvider: AAProvider;
    auth: SnowballAuth;
    getAddress(): Promise<Address>;
    sendUserOp(targetAddress: Address, data: Hex, sponsorGas: Boolean): Promise<SendUserOperationResult>;
}
export declare class Snowball {
    private apiKey;
    private chain;
    private authProvider;
    private aaProvider;
    auth: SnowballAuth;
    smartWallet: SnowballSmartWallet | undefined;
    constructor(apiKey: string, authProvider: AuthProvider, chain: Chain);
    initAuthProvider(authProvider?: AuthProvider): SnowballAuth;
    initAAProvider(aaProvider: AAProvider): Promise<SnowballSmartWallet>;
    sendUserOperation(targetAddress: Address, data: Hex, sponsorGas: Boolean): Promise<SendUserOperationResult>;
}
