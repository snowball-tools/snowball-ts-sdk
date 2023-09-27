"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartWallet = void 0;
const AlchemySmartWallet_1 = require("./providers/AlchemySmartWallet");
const helpers_1 = require("../helpers");
class SmartWallet {
    constructor(ethersWallet, auth, smartWalletProviderInfo) {
        Object.defineProperty(this, "smartWalletProvider", {
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
        Object.defineProperty(this, "auth", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "simpleAccountOwner", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "address", {
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
        this.auth = auth;
        this.smartWalletProviderInfo = smartWalletProviderInfo;
        this.ethersWallet = ethersWallet;
    }
    async getSimpleAccountOwner() {
        try {
            const owner = {
                signMessage: async (msg) => {
                    return (await this.ethersWallet.signMessage(msg));
                },
                getAddress: async () => {
                    return (await this.ethersWallet.getAddress());
                },
                signTypedData: async (params) => {
                    const types = {
                        [params.primaryType]: params.types["x"].map((value) => ({
                            name: value.name,
                            type: value.type,
                        })),
                    };
                    return (await this.ethersWallet._signTypedData(params.domain ? params.domain : {}, types, params.message));
                },
            };
            this.simpleAccountOwner = owner;
            return owner;
        }
        catch (error) {
            return Promise.reject(`Get Simple Account Owner failed ${JSON.stringify(error)}`);
        }
    }
    async getAddress() {
        if (this.address) {
            return this.address;
        }
        try {
            const owner = this.simpleAccountOwner
                ? this.simpleAccountOwner
                : await this.getSimpleAccountOwner();
            this.address = await owner.getAddress();
            return this.address;
        }
        catch (error) {
            throw new Error(`Error getting address ${JSON.stringify(error)}`);
        }
    }
    async changeChain() {
        if (this.smartWalletProvider === undefined) {
            this.smartWalletProvider = await this.initSmartWalletProvider();
        }
        try {
            this.simpleAccountOwner = await this.getSimpleAccountOwner();
            this.smartWalletProvider.changeChain(this.auth.chain);
        }
        catch (error) {
            return Promise.reject(`changeChain failed ${JSON.stringify(error)}`);
        }
    }
    async sendUserOperation(targetAddress, data, sponsorGas) {
        try {
            if (this.smartWalletProvider === undefined) {
                this.smartWalletProvider = await this.initSmartWalletProvider();
            }
            switch (this.smartWalletProviderInfo.name) {
                case helpers_1.SmartWalletProvider.alchemy:
                    return await this.smartWalletProvider.sendUserOperation(targetAddress, data, sponsorGas);
                case helpers_1.SmartWalletProvider.fun:
                default:
                    throw new Error("Auth Provider has not been impl yet");
            }
        }
        catch (error) {
            return Promise.reject(`sendUserOperation failed ${JSON.stringify(error)}`);
        }
    }
    async initSmartWalletProvider() {
        try {
            if (this.simpleAccountOwner === undefined) {
                this.simpleAccountOwner = await this.getSimpleAccountOwner();
            }
            switch (this.smartWalletProviderInfo.name) {
                case helpers_1.SmartWalletProvider.alchemy:
                    return new AlchemySmartWallet_1.AlchemySmartWallet(this.simpleAccountOwner, this.smartWalletProviderInfo, this.auth.chain);
                case helpers_1.SmartWalletProvider.fun:
                default:
                    throw new Error("Auth Provider has not been impl yet");
            }
        }
        catch (error) {
            return Promise.reject(`initSmartWalletProvider failed ${JSON.stringify(error)}`);
        }
    }
    async waitForUserOperationTransaction(hash) {
        try {
            if (this.smartWalletProvider === undefined) {
                this.smartWalletProvider = await this.initSmartWalletProvider();
            }
            switch (this.smartWalletProviderInfo.name) {
                case helpers_1.SmartWalletProvider.alchemy:
                    return await this.smartWalletProvider.waitForUserOperationTransaction(hash);
                case helpers_1.SmartWalletProvider.fun:
                default:
                    throw new Error("Auth Provider has not been impl yet");
            }
        }
        catch (error) {
            return Promise.reject(`waitForUserOperationTransaction failed ${JSON.stringify(error)}`);
        }
    }
    async getUserOperationByHash(hash) {
        try {
            if (this.smartWalletProvider === undefined) {
                this.smartWalletProvider = await this.initSmartWalletProvider();
            }
            switch (this.smartWalletProviderInfo.name) {
                case helpers_1.SmartWalletProvider.alchemy:
                    return await this.smartWalletProvider.getUserOperationByHash(hash);
                case helpers_1.SmartWalletProvider.fun:
                default:
                    throw new Error("Auth Provider has not been impl yet");
            }
        }
        catch (error) {
            return Promise.reject(`getUserOperationByHash failed ${JSON.stringify(error)}`);
        }
    }
    async getUserOperationReceipt(hash) {
        try {
            if (this.smartWalletProvider === undefined) {
                this.smartWalletProvider = await this.initSmartWalletProvider();
            }
            switch (this.smartWalletProviderInfo.name) {
                case helpers_1.SmartWalletProvider.alchemy:
                    return await this.smartWalletProvider.getUserOperationReceipt(hash);
                case helpers_1.SmartWalletProvider.fun:
                default:
                    throw new Error("Auth Provider has not been impl yet");
            }
        }
        catch (error) {
            return Promise.reject(`getUserOperationByHash failed ${JSON.stringify(error)}`);
        }
    }
}
exports.SmartWallet = SmartWallet;
//# sourceMappingURL=SmartWallet.js.map