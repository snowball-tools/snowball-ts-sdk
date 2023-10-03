"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Snowball = void 0;
const constants_1 = require("../helpers/constants");
const wallet_1 = require("../wallet");
const Passkey_1 = require("../auth/Passkey");
const env_1 = require("../helpers/env");
class Snowball {
    apiKey;
    chain;
    authProviderInfo;
    smartWalletProviderInfo;
    auth;
    smartWallet;
    ethersWallet;
    constructor(apiKey, chain, authProviderInfo, smartWalletProviderInfo) {
        this.apiKey = apiKey;
        this.chain = chain;
        this.authProviderInfo =
            authProviderInfo.name == constants_1.AuthProvider.lit
                ? {
                    name: authProviderInfo.name,
                    apiKeys: {
                        relayKey: env_1.LIT_RELAY_API_KEY + "_" + this.apiKey,
                    },
                }
                : authProviderInfo;
        this.smartWalletProviderInfo = smartWalletProviderInfo;
        this.auth = new Passkey_1.SnowballPasskey(this.chain, this.authProviderInfo);
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
            this.smartWallet = new wallet_1.SmartWallet(this.ethersWallet, this.auth, this.smartWalletProviderInfo);
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
    async waitForUserOperationTransaction(hash) {
        try {
            if (this.smartWallet === undefined) {
                this.smartWallet = await this.initSmartWallet();
            }
            return await this.smartWallet.waitForUserOperationTransaction(hash);
        }
        catch (error) {
            return Promise.reject(`waitForUserOperationTransaction failed ${error}`);
        }
    }
    async getUserOperationByHash(hash) {
        try {
            if (this.smartWallet === undefined) {
                this.smartWallet = await this.initSmartWallet();
            }
            return await this.smartWallet.getUserOperationByHash(hash);
        }
        catch (error) {
            return Promise.reject(`getUserOperationByHash failed ${error}`);
        }
    }
    async getUserOperationReceipt(hash) {
        try {
            if (this.smartWallet === undefined) {
                this.smartWallet = await this.initSmartWallet();
            }
            return await this.smartWallet.getUserOperationReceipt(hash);
        }
        catch (error) {
            return Promise.reject(`getUserOperationReceipt failed ${error}`);
        }
    }
}
exports.Snowball = Snowball;
