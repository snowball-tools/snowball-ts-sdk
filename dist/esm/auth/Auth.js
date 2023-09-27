import { AuthProvider } from "../helpers";
import { SnowballPasskey } from "./Passkey";
export class Auth {
    constructor(chain, authProviderInfo) {
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
        this.authProviderInfo = authProviderInfo;
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
    changeChain(chain) {
        this.chain = chain;
        this.authProvider.changeChain(chain);
    }
}
//# sourceMappingURL=Auth.js.map