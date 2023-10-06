import { LitAuthClient, WebAuthnProvider } from "@lit-protocol/lit-auth-client";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import type { IRelayPKP, SessionSigsMap } from "@lit-protocol/types";
import { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import { Chain } from "../../helpers";
import { Passkey } from "./Passkey";
import { AuthProviderInfo } from "./types";
export declare class LitPasskey extends Passkey {
    litAuthClient: LitAuthClient;
    webAuthnProvider: WebAuthnProvider;
    litNodeClient: LitNodeClient;
    private authenticated;
    private pkpPublicKey;
    private sessionSig;
    private pkpWallet;
    constructor(chain: Chain, authProvider: AuthProviderInfo);
    registerPasskey(username: string): Promise<void>;
    authenticatePasskey(): Promise<void>;
    fetchPkpsForAuthMethod(): Promise<IRelayPKP[]>;
    getSessionSigs(switchChain?: boolean): Promise<SessionSigsMap>;
    getEthersWallet(): Promise<PKPEthersWallet>;
}
