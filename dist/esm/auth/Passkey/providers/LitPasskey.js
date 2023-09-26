import { LitAuthClient, WebAuthnProvider } from "@lit-protocol/lit-auth-client";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import { DEFAULT_EXP } from "../../../helpers/constants";
import { ProviderType } from "@lit-protocol/constants";
import { LitAbility, LitActionResource } from "@lit-protocol/auth-helpers";
export class LitPasskey {
    constructor(chain, authProvider) {
        Object.defineProperty(this, "litAuthClient", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "webAuthnProvider", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "litNodeClient", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "authenticated", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "pkpPublicKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "sessionSig", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "pkpWallet", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "chain", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "authProviderInfo", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
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
        this.chain = chain;
        this.authProviderInfo = authProvider;
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
            return Promise.reject(`registerPasskey failed: ${error}`);
        }
    }
    async authenticatePasskey() {
        try {
            this.authenticated = await this.webAuthnProvider.authenticate();
            return Promise.resolve();
        }
        catch (error) {
            return Promise.reject(`Authentication failed ${error}`);
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
            return Promise.reject(`Retrieving PKPs failed ${error}`);
        }
    }
    async getSessionSigs() {
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
    async getEthersWallet() {
        try {
            if (this.sessionSig === undefined) {
                this.sessionSig = await this.getSessionSigs();
            }
            if (this.pkpPublicKey === undefined) {
                const pkps = await this.fetchPkpsForAuthMethod();
                this.pkpPublicKey = pkps[0].publicKey;
            }
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
}
//# sourceMappingURL=LitPasskey.js.map