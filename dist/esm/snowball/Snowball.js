import { AuthProvider, } from "../helpers/constants";
import { SmartWallet } from "../wallet";
import { SnowballPasskey } from "../auth/Passkey";
import { LIT_RELAY_API_KEY } from "../helpers/env";
export class Snowball {
    constructor(apiKey, chain, authProviderInfo, smartWalletProviderInfo) {
        Object.defineProperty(this, "apiKey", {
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
        Object.defineProperty(this, "smartWalletProviderInfo", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "auth", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "smartWallet", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "ethersWallet", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.apiKey = apiKey;
        this.chain = chain;
        this.authProviderInfo =
            authProviderInfo.name == AuthProvider.lit
                ? {
                    name: authProviderInfo.name,
                    apiKeys: {
                        relayKey: LIT_RELAY_API_KEY + "_" + this.apiKey,
                    },
                }
                : authProviderInfo;
        this.smartWalletProviderInfo = smartWalletProviderInfo;
        this.auth = new SnowballPasskey(this.chain, this.authProviderInfo);
    }
    async register(username) {
        try {
            return await this.auth.register(username);
        }
        catch (error) {
            return Promise.reject(`register failed ${error}`);
        }
    }
    async authenticate() {
        try {
            return await this.auth.authenticate();
        }
        catch (error) {
            return Promise.reject(`authenticate failed ${error}`);
        }
    }
    async getEthersWallet() {
        try {
            return await this.auth.getEthersWallet();
        }
        catch (error) {
            return Promise.reject(`getEthersWallet failed ${error}`);
        }
    }
    async changeChain(chain) {
        try {
            if (this.smartWallet === undefined) {
                this.smartWallet = await this.initSmartWallet();
            }
            this.chain = chain;
            this.smartWallet.changeChain();
        }
        catch (error) {
            return Promise.reject(`changeChain failed ${error}`);
        }
    }
    async getAddress() {
        try {
            if (this.smartWallet === undefined) {
                this.smartWallet = await this.initSmartWallet();
            }
            return await this.smartWallet.getAddress();
        }
        catch (error) {
            return Promise.reject(`getAddress failed ${error}`);
        }
    }
    async initSmartWallet() {
        try {
            if (this.ethersWallet === undefined) {
                this.ethersWallet = await this.getEthersWallet();
            }
            this.smartWallet = new SmartWallet(this.ethersWallet, this.auth, this.smartWalletProviderInfo);
            return this.smartWallet;
        }
        catch (error) {
            return Promise.reject(`initSmartWallet failed ${error}`);
        }
    }
    async sendUserOperation(targetAddress, data, sponsorGas) {
        try {
            if (this.smartWallet === undefined) {
                this.smartWallet = await this.initSmartWallet();
            }
            return await this.smartWallet.sendUserOperation(targetAddress, data, sponsorGas);
        }
        catch (error) {
            return Promise.reject(`sendUserOperation failed ${error}`);
        }
    }
}
//# sourceMappingURL=Snowball.js.map