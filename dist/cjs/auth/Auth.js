"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const helpers_1 = require("../helpers");
const Passkey_1 = require("./Passkey");
class Auth {
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
                case helpers_1.AuthProvider.lit:
                    return await this.authProvider.register(username);
                case helpers_1.AuthProvider.turnkey:
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
                case helpers_1.AuthProvider.lit:
                    return await this.authProvider.authenticate();
                case helpers_1.AuthProvider.turnkey:
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
                case helpers_1.AuthProvider.lit:
                    return await this.authProvider.getEthersWallet();
                case helpers_1.AuthProvider.turnkey:
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
            case helpers_1.AuthProvider.lit:
            case helpers_1.AuthProvider.turnkey:
            default:
                return new Passkey_1.SnowballPasskey(this.chain, this.authProviderInfo);
        }
    }
    changeChain(chain) {
        this.chain = chain;
        this.authProvider.changeChain(chain);
    }
}
exports.Auth = Auth;
//# sourceMappingURL=Auth.js.map