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
        Object.defineProperty(this, "provider", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.chain = chain;
        this.authProviderInfo = authProviderInfo;
        this.provider = this.initAuthProvider();
    }
    isWebAuthnSupported() {
        throw new Error("Method not implemented.");
    }
    async register(username) {
        try {
            switch (this.authProviderInfo.name) {
                case helpers_1.AuthProvider.lit:
                case helpers_1.AuthProvider.turnkey:
                    return await this.provider.register(username);
                default:
                    throw new Error("Method not implemented.");
            }
        }
        catch (e) {
            console.log("Error registering");
            console.log(e);
        }
    }
    async authenticate() {
        try {
            switch (this.authProviderInfo.name) {
                case helpers_1.AuthProvider.lit:
                case helpers_1.AuthProvider.turnkey:
                    return await this.provider.authenticate();
                default:
                    throw new Error("Method not implemented.");
            }
        }
        catch (e) {
            console.log("Error authenticating");
            console.log(e);
        }
    }
    async getEthersWallet() {
        switch (this.authProviderInfo.name) {
            case helpers_1.AuthProvider.lit:
            case helpers_1.AuthProvider.turnkey:
                return await this.provider.getEthersWallet();
            default:
                throw new Error("Method not implemented.");
        }
    }
    initAuthProvider() {
        switch (this.authProviderInfo.name) {
            case helpers_1.AuthProvider.lit:
            case helpers_1.AuthProvider.turnkey:
                return new Passkey_1.SnowballPasskey(this.chain, this.authProviderInfo);
            default:
                throw new Error("Method not implemented.");
        }
    }
}
exports.Auth = Auth;
//# sourceMappingURL=Auth.js.map