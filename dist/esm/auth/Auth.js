import { AuthProvider } from "../helpers";
import { SnowballPasskey } from "./Passkey";
import { LIT_RELAY_API_KEY } from "../helpers/env";
export class Auth {
    constructor(chain, authProviderInfo, snowballAPIKey) {
        Object.defineProperty(this, "authProviderInfo", {
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
        Object.defineProperty(this, "authProvider", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.chain = chain;
        this.authProviderInfo = {
            name: authProviderInfo.name,
            apiKeys: {
                relayKey: LIT_RELAY_API_KEY + "_" + snowballAPIKey,
            },
        };
        this.authProvider = this.initAuthProvider();
    }
    async register(username) {
        try {
            switch (this.authProviderInfo.name) {
                case AuthProvider.lit:
                    return await this.authProvider.register(username);
                case AuthProvider.turnkey:
                default:
                    return Promise.reject("Method not implemented.");
            }
        }
        catch (e) {
            Promise.reject(`registering failed ${JSON.stringify(e)}`);
        }
    }
    async authenticate() {
        try {
            switch (this.authProviderInfo.name) {
                case AuthProvider.lit:
                    return await this.authProvider.authenticate();
                case AuthProvider.turnkey:
                default:
                    return Promise.reject("Method not implemented.");
            }
        }
        catch (e) {
            return Promise.reject(`authenticating failed ${JSON.stringify(e)}`);
        }
    }
    async getEthersWallet() {
        try {
            switch (this.authProviderInfo.name) {
                case AuthProvider.lit:
                    return await this.authProvider.getEthersWallet();
                case AuthProvider.turnkey:
                default:
                    return Promise.reject("Method not implemented.");
            }
        }
        catch (e) {
            return Promise.reject(`getEthersWallet failed ${JSON.stringify(e)}`);
        }
    }
    initAuthProvider() {
        switch (this.authProviderInfo.name) {
            case AuthProvider.lit:
            case AuthProvider.turnkey:
            default:
                return new SnowballPasskey(this.chain, this.authProviderInfo);
        }
    }
    async changeChain(chain) {
        try {
            this.chain = chain;
            return await this.authProvider.changeChain(chain);
        }
        catch (error) {
            return Promise.reject(`changeChain failed ${JSON.stringify(error)}`);
        }
    }
}
//# sourceMappingURL=Auth.js.map