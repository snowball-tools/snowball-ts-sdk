import type { SimpleSmartAccountOwner, Address, Hex, ISmartAccountProvider, SendUserOperationResult } from "@alchemy/aa-core";
import type { Chain } from "../helpers/chains";
import type { FallbackTransport, Transport } from "viem";
import type { AuthMethod } from "@lit-protocol/types";
import { type AuthProvider, type AAProvider } from "../helpers/constants";
export interface SnowballAuth {
    authProvider: AuthProvider;
    chain: Chain;
    registerPasskey(username: string): Promise<void>;
    authenticatePasskey(): Promise<AuthMethod>;
    getSimpleAccountOwner(): Promise<SimpleSmartAccountOwner>;
}
export interface SnowballSmartWallet<TTransport extends Transport | FallbackTransport = Transport> extends ISmartAccountProvider<TTransport> {
    aaProvider: AAProvider;
    auth: SnowballAuth;
    sendUserOp(targetAddress: Address, data: Hex, sponsorGas: Boolean): Promise<SendUserOperationResult>;
}
export declare class Snowball {
    private apiKey;
    private chain;
    private authProvider;
    private aaProvider;
    auth: SnowballAuth;
    smartWallet: SnowballSmartWallet | undefined;
    address: Address | undefined;
    constructor(apiKey: string, authProvider: AuthProvider, aaProvider: AAProvider, chain: Chain);
    initAuthProvider(authProvider?: AuthProvider): SnowballAuth;
    initAAProvider(aaProvider?: AAProvider): Promise<SnowballSmartWallet>;
    getSmartWalletAddress(): Promise<Address>;
    sendUserOperation(targetAddress: Address, data: Hex, sponsorGas: Boolean): Promise<SendUserOperationResult>;
}
