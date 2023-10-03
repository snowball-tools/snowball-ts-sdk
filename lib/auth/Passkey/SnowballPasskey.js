"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnowballPasskey = void 0;
const helpers_1 = require("../../helpers");
const providers_1 = require("./providers");
class SnowballPasskey {
    chain;
    authProviderInfo;
    passkeyProvider;
    constructor(chain, authProviderInfo) {
        this.chain = chain;
        this.authProviderInfo = authProviderInfo;
        this.passkeyProvider = this.initPasskeyProvider(authProviderInfo);
    }
    async register(username) {
        try {
            switch (this.authProviderInfo.name) {
                case helpers_1.AuthProvider.lit:
                    return await this.passkeyProvider.registerPasskey(username);
                case helpers_1.AuthProvider.turnkey:
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
                    return await this.passkeyProvider.authenticatePasskey();
                case helpers_1.AuthProvider.turnkey:
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
        try {
            switch (this.authProviderInfo.name) {
                case helpers_1.AuthProvider.lit:
                    return await this.passkeyProvider.getEthersWallet();
                case helpers_1.AuthProvider.turnkey:
                default:
                    throw new Error("Method not implemented.");
            }
        }
        catch (e) {
            console.log("Error getting ethers wallet");
            console.log(e);
            throw Promise.reject(e);
        }
    }
    initPasskeyProvider(authProviderInfo) {
        switch (authProviderInfo.name) {
            case helpers_1.AuthProvider.lit:
                return new providers_1.LitPasskey(this.chain, authProviderInfo);
            case helpers_1.AuthProvider.turnkey:
            default:
                throw new Error("Auth Provider has not been impl yet");
        }
    }
    changeChain(chain) {
        this.chain = chain;
        this.passkeyProvider.chain = chain;
    }
}
exports.SnowballPasskey = SnowballPasskey;
