import { LitAuthClient, WebAuthnProvider } from "@lit-protocol/lit-auth-client";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import type { AuthMethod, IRelayPKP, SessionSigsMap } from "@lit-protocol/types";
import { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import type { SimpleSmartAccountOwner } from "@alchemy/aa-core";
import { type AuthProvider } from "../helpers/constants";
import type { Chain } from "../helpers/chains";
import { Passkey } from "./Passkey";
export declare class LitPasskey extends Passkey {
    litAuthClient: LitAuthClient;
    webAuthnProvider: WebAuthnProvider;
    litNodeClient: LitNodeClient;
    private authenticated;
    private pkpPublicKey;
    private pkpEthAddress;
    private sessionSig;
    private pkpWallet;
    simpleAccountOwner: SimpleSmartAccountOwner | undefined;
    constructor(chain: Chain, authProvider: AuthProvider);
    registerPasskey(username: string): Promise<void>;
    authenticatePasskey(): Promise<AuthMethod>;
    fetchPkpsForAuthMethod(): Promise<IRelayPKP[]>;
    getSessionSigs(): Promise<SessionSigsMap>;
    createPkpEthersWallet(): Promise<PKPEthersWallet>;
    getSimpleAccountOwner(): Promise<SimpleSmartAccountOwner>;
}
