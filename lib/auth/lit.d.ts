import { IRelayPKP } from "@lit-protocol/types";
import { SimpleSmartAccountOwner } from "@alchemy/aa-core";
import { Chain } from "../helpers/chains";
import { SnowballAuth } from "..";
declare class LitAuth implements SnowballAuth {
    private litAuthClient;
    private webAuthnProvider;
    private litNodeClient;
    private authenticated;
    private pkpPublicKey;
    private pkpEthAddress;
    private sessionSig;
    private pkpWallet;
    chain: Chain;
    simpleAccountOwner: SimpleSmartAccountOwner | undefined;
    constructor(apiKey: string, chain: Chain);
    registerPasskey(username: string): Promise<Boolean>;
    authenticatePasskey(): Promise<Boolean>;
    fetchPkpsForAuthMethod(): Promise<IRelayPKP[]>;
    getSessionSigs(): Promise<Boolean>;
    createPkpEthersWallet(): Promise<Boolean>;
    getSimpleAccountOwner(): Promise<SimpleSmartAccountOwner>;
}
export default LitAuth;
