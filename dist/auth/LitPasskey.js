import { LitAuthClient, WebAuthnProvider } from "@lit-protocol/lit-auth-client";
import { ProviderType } from "@lit-protocol/constants";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LitAbility, LitActionResource } from "@lit-protocol/auth-helpers";
import { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import { DEFAULT_EXP } from "../helpers/constants";
import { Passkey } from "./Passkey";
export class LitPasskey extends Passkey {
    litAuthClient;
    webAuthnProvider;
    litNodeClient;
    authenticated;
    pkpPublicKey;
    pkpEthAddress;
    sessionSig;
    pkpWallet;
    // to do: get setter
    simpleAccountOwner;
    constructor(chain, authProvider) {
        super(chain, authProvider);
        this.litAuthClient = new LitAuthClient({
            litRelayConfig: {
                relayApiKey: authProvider.apiKeys[`relayKey`],
            },
        });
        this.litAuthClient.initProvider(ProviderType.WebAuthn);
        this.webAuthnProvider = this.litAuthClient.getProvider(ProviderType.WebAuthn);
        this.litNodeClient = new LitNodeClient({
            litNetwork: "serrano",
            debug: false,
        });
    }
    async registerPasskey(username) {
        try {
            const options = await this.webAuthnProvider.register(username);
            const txHash = await this.webAuthnProvider.verifyAndMintPKPThroughRelayer(options);
            const response = await this.webAuthnProvider.relay.pollRequestUntilTerminalState(txHash);
            if (response.pkpEthAddress === undefined ||
                response.pkpPublicKey === undefined) {
                return Promise.reject(`pollRequestUntilTerminalState failed ${response}`);
            }
            this.pkpPublicKey = response.pkpPublicKey;
            this.pkpEthAddress = response.pkpEthAddress;
            return Promise.resolve();
        }
        catch (error) {
            return Promise.reject(`registerPasskey failed: ${error}`);
        }
    }
    async authenticatePasskey() {
        try {
            this.authenticated = await this.webAuthnProvider.authenticate();
            return this.authenticated;
        }
        catch (error) {
            return Promise.reject(`Authentication failed ${error}`);
        }
    }
    async fetchPkpsForAuthMethod() {
        try {
            if (this.authenticated === undefined) {
                this.authenticated = await this.authenticatePasskey();
            }
            const pkps = await this.webAuthnProvider.fetchPKPsThroughRelayer(this.authenticated);
            if (pkps.length === 0 || pkps === undefined) {
                return Promise.reject("No PKPs found");
            }
            this.pkpPublicKey = pkps[0].publicKey;
            this.pkpEthAddress = pkps[0].ethAddress;
            return pkps;
        }
        catch (error) {
            return Promise.reject(`Retrieving PKPs failed ${error}`);
        }
    }
    async getSessionSigs() {
        try {
            if (this.pkpPublicKey === undefined) {
                this.pkpPublicKey = await this.fetchPkpsForAuthMethod()
                    .catch((error) => {
                    return Promise.reject(`Transaction failed ${error}`);
                })
                    .then((pkps) => {
                    return pkps[0].publicKey;
                });
            }
            await this.litNodeClient.connect();
            const authNeededCallback = async (params) => {
                const resp = await this.litNodeClient.signSessionKey({
                    statement: params.statement,
                    authMethods: [this.authenticated],
                    pkpPublicKey: this.pkpPublicKey,
                    expiration: params.expiration,
                    resources: params.resources,
                    chainId: this.chain.chainId,
                });
                return resp.authSig;
            };
            this.sessionSig = await this.litNodeClient.getSessionSigs({
                expiration: DEFAULT_EXP,
                chain: this.chain.name,
                resourceAbilityRequests: [
                    {
                        resource: new LitActionResource("*"),
                        ability: LitAbility.PKPSigning,
                    },
                ],
                switchChain: false,
                authNeededCallback: authNeededCallback,
            });
            if (this.sessionSig === undefined) {
                return Promise.reject("No session sigs found");
            }
            return this.sessionSig;
        }
        catch (error) {
            return Promise.reject(`Retrieving session sigs failed ${error}`);
        }
    }
    async createPkpEthersWallet() {
        if (this.sessionSig === undefined) {
            this.sessionSig = await this.getSessionSigs();
        }
        try {
            this.pkpWallet = new PKPEthersWallet({
                controllerSessionSigs: this.sessionSig,
                pkpPubKey: this.pkpPublicKey,
                rpc: "https://chain-rpc.litprotocol.com/http",
            });
            await this.pkpWallet.init();
            return this.pkpWallet;
        }
        catch (error) {
            return Promise.reject(`Transaction failed ${error}`);
        }
    }
    async getSimpleAccountOwner() {
        if (this.simpleAccountOwner) {
            return this.simpleAccountOwner;
        }
        try {
            if (this.pkpWallet === undefined) {
                this.pkpWallet = await this.createPkpEthersWallet();
            }
            const owner = {
                signMessage: async (msg) => {
                    return (await this.pkpWallet.signMessage(msg));
                },
                getAddress: async () => {
                    return (await this.pkpWallet.getAddress());
                },
                signTypedData: async (params) => {
                    const types = {
                        [params.primaryType]: params.types["x"].map((value) => ({
                            name: value.name,
                            type: value.type,
                        })),
                    };
                    return (await this.pkpWallet._signTypedData(params.domain ? params.domain : {}, types, params.message));
                },
            };
            this.simpleAccountOwner = owner;
            return owner;
        }
        catch (error) {
            return Promise.reject(`Get Simple Account Owner failed ${error}`);
        }
    }
}
//# sourceMappingURL=LitPasskey.js.map