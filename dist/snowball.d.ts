import type { SimpleSmartAccountOwner, Address, Hex, ISmartAccountProvider, SendUserOperationResult } from "@alchemy/aa-core";
import type { Chain } from "./helpers/chains";
import type { FallbackTransport, Transport } from "viem";
import type { AuthMethod } from "@lit-protocol/types";
export interface SnowballAuth {
    chain: Chain;
    isWebAuthnSupported(): boolean;
    registerPasskey(username: string): Promise<void>;
    authenticatePasskey(): Promise<AuthMethod>;
    getSimpleAccountOwner(): Promise<SimpleSmartAccountOwner>;
}
export interface SnowballSmartWallet<TTransport extends Transport | FallbackTransport = Transport> extends ISmartAccountProvider<TTransport> {
    auth: SnowballAuth;
    sendUserOp(targetAddress: Address, data: Hex, sponsorGas: Boolean): Promise<SendUserOperationResult>;
}
export declare class Snowball {
    auth: SnowballAuth;
    smartWallet: SnowballSmartWallet;
    constructor(smartWallet: SnowballSmartWallet);
    getSmartWalletAddress(): Promise<Address>;
    sendUserOperation(targetAddress: Address, data: Hex, sponsorGas: Boolean): Promise<SendUserOperationResult>;
}
