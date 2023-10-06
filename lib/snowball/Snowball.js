"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Snowball = void 0;
const env_1 = require("../helpers/env");
const wallet_1 = require("../wallet");
const Passkey_1 = require("../auth/Passkey");
const types_1 = require("../wallet/types");
const types_2 = require("../auth/Passkey/types");
class Snowball {
    apiKey;
    chain;
    authProviderInfo;
    smartWalletProviderInfo;
    auth;
    smartWallet;
    constructor(apiKey, chain, authProviderInfo, smartWalletProviderInfo) {
        this.apiKey = apiKey;
        this.chain = chain;
        this.authProviderInfo =
            authProviderInfo.name == types_2.AuthProvider.lit
                ? {
                    name: authProviderInfo.name,
                    apiKeys: {
                        relayKey: env_1.LIT_RELAY_API_KEY + "_" + this.apiKey,
                    },
                }
                : authProviderInfo;
        this.smartWalletProviderInfo = smartWalletProviderInfo;
        this.auth = this.initAuth();
        this.smartWallet = this.initSmartWallet();
    }
    initAuth() {
        switch (this.authProviderInfo.name) {
            case types_2.AuthProvider.lit:
                return new Passkey_1.LitPasskey(this.chain, this.authProviderInfo);
            case types_2.AuthProvider.turnkey:
                return new Passkey_1.TurkeyPasskey(this.chain, this.authProviderInfo);
        }
    }
    initSmartWallet() {
        switch (this.smartWalletProviderInfo.name) {
            case types_1.SmartWalletProvider.alchemy:
                return new wallet_1.AlchemySmartWallet(this.auth, this.smartWalletProviderInfo);
            case types_1.SmartWalletProvider.fun:
                return new wallet_1.FunSmartWallet(this.auth, this.smartWalletProviderInfo);
        }
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
    async switchChain(chain) {
        try {
            this.chain = chain;
            this.smartWallet.switchChain();
        }
        catch (error) {
            return Promise.reject(`changeChain failed ${error}`);
        }
    }
    async getAddress() {
        try {
            return await this.smartWallet.getAddress();
        }
        catch (error) {
            return Promise.reject(`getAddress failed ${error}`);
        }
    }
    async sendUserOperation(targetAddress, data, sponsorGas) {
        try {
            return await this.smartWallet.sendUserOperation(targetAddress, data, sponsorGas);
        }
        catch (error) {
            return Promise.reject(`sendUserOperation failed ${error}`);
        }
    }
    async waitForUserOperationTransaction(hash) {
        try {
            return await this.smartWallet.waitForUserOperationTransaction(hash);
        }
        catch (error) {
            return Promise.reject(`waitForUserOperationTransaction failed ${error}`);
        }
    }
    async getUserOperationByHash(hash) {
        try {
            return await this.smartWallet.getUserOperationByHash(hash);
        }
        catch (error) {
            return Promise.reject(`getUserOperationByHash failed ${error}`);
        }
    }
    async getUserOperationReceipt(hash) {
        try {
            return await this.smartWallet.getUserOperationReceipt(hash);
        }
        catch (error) {
            return Promise.reject(`getUserOperationReceipt failed ${error}`);
        }
    }
}
exports.Snowball = Snowball;
//# sourceMappingURL=Snowball.js.map