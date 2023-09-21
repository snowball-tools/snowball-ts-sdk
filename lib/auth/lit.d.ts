import { LitAuthClient, WebAuthnProvider } from "@lit-protocol/lit-auth-client";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { IRelayPKP } from "@lit-protocol/types";
import { SimpleSmartAccountOwner } from "@alchemy/aa-core";
import { Chain } from "../helpers/chains";
import Passkey from "./passkey";
declare class LitAuth extends Passkey {
    litAuthClient: LitAuthClient;
    webAuthnProvider: WebAuthnProvider;
    litNodeClient: LitNodeClient;
    private authenticated;
    private pkpPublicKey;
    private pkpEthAddress;
    private sessionSig;
    private pkpWallet;
    simpleAccountOwner: SimpleSmartAccountOwner | undefined;
    constructor(apiKey: string, chain: Chain);
    registerPasskey(username: string): Promise<void>;
    authenticatePasskey(): Promise<void>;
    fetchPkpsForAuthMethod(): Promise<IRelayPKP[]>;
    getSessionSigs(): Promise<Boolean>;
    createPkpEthersWallet(): Promise<Boolean>;
    getSimpleAccountOwner(): Promise<SimpleSmartAccountOwner>;
}
export default LitAuth;
