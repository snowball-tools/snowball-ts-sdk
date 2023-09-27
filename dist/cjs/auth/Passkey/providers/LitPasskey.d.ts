import { LitAuthClient, WebAuthnProvider } from "@lit-protocol/lit-auth-client";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import type { IRelayPKP, SessionSigsMap } from "@lit-protocol/types";
import { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import { type AuthProviderInfo } from "../../../helpers/constants";
import type { Chain } from "../../../helpers/chains";
import type { SnowballPasskeyProvider } from "./SnowballPasskeyProvider";
export declare class LitPasskey implements SnowballPasskeyProvider {
    litAuthClient: LitAuthClient;
    webAuthnProvider: WebAuthnProvider;
    litNodeClient: LitNodeClient;
    private authenticated;
    private pkpPublicKey;
    private sessionSig;
    private pkpWallet;
    chain: Chain;
    authProviderInfo: AuthProviderInfo;
    constructor(chain: Chain, authProvider: AuthProviderInfo);
    registerPasskey(username: string): Promise<void>;
    authenticatePasskey(): Promise<void>;
    changeChain(chain: Chain): Promise<PKPEthersWallet>;
    fetchPkpsForAuthMethod(): Promise<IRelayPKP[]>;
    getSessionSigs(switchChain?: boolean): Promise<SessionSigsMap>;
    getEthersWallet(): Promise<PKPEthersWallet>;
}
