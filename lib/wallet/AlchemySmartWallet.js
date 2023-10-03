"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlchemySmartWallet = void 0;
const aa_core_1 = require("@alchemy/aa-core");
const aa_alchemy_1 = require("@alchemy/aa-alchemy");
const chains_1 = require("../helpers/chains");
const SmartWallet_1 = require("./SmartWallet");
class AlchemySmartWallet extends SmartWallet_1.SmartWallet {
    provider;
    async getAddress() {
        if (this.address) {
            return this.address;
        }
        try {
            const owner = await super.getSimpleAccountOwner();
            this.address = await owner.getAddress();
            return this.address;
        }
        catch (error) {
            throw new Error(`Error getting address ${JSON.stringify(error)}`);
        }
    }
    async sendUserOperation(targetAddress, data, sponsorGas) {
        try {
            this.provider = this.provider
                ? this.provider
                : await this.initAlchemyProvider();
            const gasPolicyId = this.smartWalletProviderInfo.apiKeys[`alchemyKey-${super.chain.name.toLowerCase()}-gasPolicyId`];
            if (gasPolicyId && sponsorGas) {
                this.provider = this.provider.withAlchemyGasManager({
                    policyId: gasPolicyId,
                    entryPoint: super.chain.entryPointAddress,
                });
            }
            const result = await this.provider.sendUserOperation({
                target: targetAddress,
                data: data,
            });
            if (result === undefined || result.hash === undefined) {
                return Promise.reject("Transaction failed");
            }
            return result;
        }
        catch (error) {
            return Promise.reject(`Transaction failed ${JSON.stringify(error)}`);
        }
    }
    async initAlchemyProvider() {
        try {
            const owner = await this.getSimpleAccountOwner();
            this.provider = new aa_alchemy_1.AlchemyProvider({
                chain: super.chain.chainId,
                entryPointAddress: super.chain.entryPointAddress,
                apiKey: this.smartWalletProviderInfo.apiKeys[`alchemyKey-${super.chain.name.toLowerCase()}`],
            }).connect((rpcClient) => new aa_core_1.SimpleSmartContractAccount({
                owner: owner,
                entryPointAddress: super.chain.entryPointAddress,
                chain: (0, chains_1.getAlchemyChain)(super.chain),
                factoryAddress: super.chain.factoryAddress,
                rpcClient,
            }));
            return this.provider;
        }
        catch (error) {
            return Promise.reject(`initAlchemyProvider failed ${JSON.stringify(error)}`);
        }
    }
    async waitForUserOperationTransaction(hash) {
        try {
            this.provider = this.provider
                ? this.provider
                : await this.initAlchemyProvider();
            return await this.provider.waitForUserOperationTransaction(hash);
        }
        catch (error) {
            return Promise.reject(`waitForUserOperationTransaction failed ${JSON.stringify(error)}`);
        }
    }
    async getUserOperationByHash(hash) {
        try {
            this.provider = this.provider
                ? this.provider
                : await this.initAlchemyProvider();
            return await this.provider.getUserOperationByHash(hash);
        }
        catch (error) {
            return Promise.reject(`getUserOperationByHash failed ${JSON.stringify(error)}`);
        }
    }
    async getUserOperationReceipt(hash) {
        try {
            this.provider = this.provider
                ? this.provider
                : await this.initAlchemyProvider();
            return await this.provider.getUserOperationReceipt(hash);
        }
        catch (error) {
            return Promise.reject(`getUserOperationByHash failed ${JSON.stringify(error)}`);
        }
    }
    async switchChain() {
        try {
            this.provider = await this.initAlchemyProvider();
        }
        catch (error) {
            return Promise.reject(`changeChain failed ${JSON.stringify(error)}`);
        }
    }
}
exports.AlchemySmartWallet = AlchemySmartWallet;
