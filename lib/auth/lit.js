import { LitAuthClient, WebAuthnProvider } from "@lit-protocol/lit-auth-client";
import { ProviderType } from "@lit-protocol/constants";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LitAbility, LitActionResource } from "@lit-protocol/auth-helpers";
import { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import { DEFAULT_EXP } from "../helpers/constants";
import { Passkey } from "./passkey";
export class LitAuth extends Passkey {
    constructor(apiKey, chain) {
        super(chain);
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
        Object.defineProperty(this, "pkpEthAddress", {
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
        // to do: get setter
        Object.defineProperty(this, "simpleAccountOwner", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.litAuthClient = new LitAuthClient({
            litRelayConfig: {
                relayApiKey: apiKey,
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
            await this.webAuthnProvider.relay
                .pollRequestUntilTerminalState(txHash)
                .catch((error) => {
                return Promise.reject(`pollRequestUntilTerminalState failed ${error}`);
            })
                .then((response) => {
                if (response.pkpEthAddress === undefined ||
                    response.pkpPublicKey === undefined) {
                    return Promise.reject(`pollRequestUntilTerminalState failed ${response}`);
                }
                this.pkpPublicKey = response.pkpPublicKey;
                this.pkpEthAddress = response.pkpEthAddress;
                return response;
            });
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
            if (this.authenticated === undefined) {
                return Promise.reject("No auth method found");
            }
            const pkps = await this.webAuthnProvider.fetchPKPsThroughRelayer(this.authenticated);
            if (pkps.length === 0) {
                return Promise.reject("No PKPs found");
            }
            return pkps;
        }
        catch (error) {
            return Promise.reject(`Retrieving PKPs failed ${error}`);
        }
    }
    async getSessionSigs() {
        try {
            if (this.authenticated === undefined) {
                await this.authenticatePasskey();
            }
            if (this.authenticated === undefined) {
                return Promise.reject("No auth method found");
            }
            if (this.pkpPublicKey === undefined) {
                await this.fetchPkpsForAuthMethod();
            }
            if (this.pkpPublicKey === undefined) {
                return Promise.reject("No PKPs found");
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
            const sessionSigs = await this.litNodeClient.getSessionSigs({
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
            if (sessionSigs === undefined) {
                return Promise.reject("Retrieving session sigs failed. undefined");
            }
            this.sessionSig = sessionSigs;
            return true;
        }
        catch (error) {
            return Promise.reject(`Retrieving session sigs failed ${error}`);
        }
    }
    async createPkpEthersWallet() {
        if (this.authenticated === undefined) {
            await this.authenticatePasskey().catch((error) => {
                return Promise.reject(`Transaction failed ${error}`);
            });
        }
        if (this.pkpPublicKey === undefined) {
            await this.fetchPkpsForAuthMethod().catch((error) => {
                return Promise.reject(`Transaction failed ${error}`);
            });
        }
        if (this.sessionSig === undefined) {
            await this.getSessionSigs().catch((error) => {
                return Promise.reject(`Transaction failed ${error}`);
            });
        }
        try {
            const pkpWallet = new PKPEthersWallet({
                controllerSessionSigs: this.sessionSig,
                pkpPubKey: this.pkpPublicKey,
                rpc: "https://chain-rpc.litprotocol.com/http",
            });
            await pkpWallet.init();
            if (pkpWallet === undefined) {
                return Promise.reject("Transaction failed. pkpWallet undefined");
            }
            this.pkpWallet = pkpWallet;
            return true;
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
                await this.createPkpEthersWallet().catch((error) => {
                    return Promise.reject(`Transaction failed ${error}`);
                });
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
//# sourceMappingURL=lit.js.map