"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LitPasskey = void 0;
const lit_auth_client_1 = require("@lit-protocol/lit-auth-client");
const lit_node_client_1 = require("@lit-protocol/lit-node-client");
const pkp_ethers_1 = require("@lit-protocol/pkp-ethers");
const constants_1 = require("../../../helpers/constants");
const constants_2 = require("@lit-protocol/constants");
const auth_helpers_1 = require("@lit-protocol/auth-helpers");
const env_1 = require("../../../helpers/env");
class LitPasskey {
    litAuthClient;
    webAuthnProvider;
    litNodeClient;
    authenticated;
    pkpPublicKey;
    sessionSig;
    pkpWallet;
    chain;
    authProviderInfo;
    constructor(chain, authProvider) {
        this.chain = chain;
        this.authProviderInfo = authProvider;
        this.litAuthClient = new lit_auth_client_1.LitAuthClient({
            litRelayConfig: {
                relayApiKey: this.authProviderInfo.apiKeys
                    ? this.authProviderInfo.apiKeys["relayKey"]
                    : env_1.LIT_RELAY_API_KEY,
            },
        });
        this.litAuthClient.initProvider(constants_2.ProviderType.WebAuthn);
        this.webAuthnProvider = this.litAuthClient.getProvider(constants_2.ProviderType.WebAuthn);
        this.litNodeClient = new lit_node_client_1.LitNodeClient({
            litNetwork: "serrano",
            debug: false,
        });
    }
    async registerPasskey(username) {
        try {
            const options = await this.webAuthnProvider.register(username);
            const txHash = await this.webAuthnProvider.verifyAndMintPKPThroughRelayer(options);
            const response = await this.webAuthnProvider.relay.pollRequestUntilTerminalState(txHash);
            if (response.pkpPublicKey === undefined) {
                return Promise.reject(`pollRequestUntilTerminalState failed ${response}`);
            }
            this.pkpPublicKey = response.pkpPublicKey;
            return Promise.resolve();
        }
        catch (error) {
            return Promise.reject(`registerPasskey failed: ${JSON.stringify(error)}`);
        }
    }
    async authenticatePasskey() {
        try {
            this.authenticated = await this.webAuthnProvider.authenticate();
            return Promise.resolve();
        }
        catch (error) {
            return Promise.reject(`Authentication failed ${JSON.stringify(error)}`);
        }
    }
    async fetchPkpsForAuthMethod() {
        try {
            if (this.authenticated === undefined) {
                await this.authenticatePasskey();
            }
            const pkps = await this.webAuthnProvider.fetchPKPsThroughRelayer(this.authenticated);
            if (pkps.length === 0 || pkps === undefined) {
                return Promise.reject("No PKPs found");
            }
            this.pkpPublicKey = pkps[0].publicKey;
            return pkps;
        }
        catch (error) {
            return Promise.reject(`Retrieving PKPs failed ${JSON.stringify(error)}`);
        }
    }
    async getSessionSigs(switchChain = false) {
        try {
            if (this.pkpPublicKey === undefined) {
                const pkps = await this.fetchPkpsForAuthMethod();
                this.pkpPublicKey = pkps[0].publicKey;
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
                expiration: constants_1.DEFAULT_EXP,
                chain: this.chain.name,
                resourceAbilityRequests: [
                    {
                        resource: new auth_helpers_1.LitActionResource("*"),
                        ability: auth_helpers_1.LitAbility.PKPSigning,
                    },
                ],
                switchChain,
                authNeededCallback: authNeededCallback,
            });
            if (this.sessionSig === undefined) {
                return Promise.reject("No session sigs found");
            }
            return this.sessionSig;
        }
        catch (error) {
            return Promise.reject(`Retrieving session sigs failed ${JSON.stringify(error)}`);
        }
    }
    async getEthersWallet() {
        try {
            if (this.sessionSig === undefined) {
                this.sessionSig = await this.getSessionSigs();
            }
            if (this.pkpPublicKey === undefined) {
                const pkps = await this.fetchPkpsForAuthMethod();
                this.pkpPublicKey = pkps[0].publicKey;
            }
            this.pkpWallet = new pkp_ethers_1.PKPEthersWallet({
                controllerSessionSigs: this.sessionSig,
                pkpPubKey: this.pkpPublicKey,
                rpc: "https://chain-rpc.litprotocol.com/http",
            });
            await this.pkpWallet.init();
            return this.pkpWallet;
        }
        catch (error) {
            return Promise.reject(`Transaction failed ${JSON.stringify(error)}`);
        }
    }
}
exports.LitPasskey = LitPasskey;
