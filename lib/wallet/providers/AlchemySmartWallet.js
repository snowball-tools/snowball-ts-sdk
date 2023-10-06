"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlchemySmartWallet = void 0;
const aa_core_1 = require("@alchemy/aa-core");
const aa_alchemy_1 = require("@alchemy/aa-alchemy");
const chains_1 = require("../../helpers/chains");
class AlchemySmartWallet {
    provider;
    chain;
    smartWalletProviderInfo;
    simpleAccountOwner;
    constructor(simpleAccountOwner, smartWalletProviderInfo, chain) {
        this.chain = chain;
        this.smartWalletProviderInfo = smartWalletProviderInfo;
        this.simpleAccountOwner = simpleAccountOwner;
        this.provider = this.initAlchemyProvider();
    }
    changeChain(chain) {
        this.chain = chain;
        this.provider = this.initAlchemyProvider();
    }
    async sendUserOperation(targetAddress, data, sponsorGas) {
        try {
            const gasPolicyId = this.smartWalletProviderInfo.apiKeys[`alchemyKey-${this.chain.name.toLowerCase()}-gasPolicyId`];
            if (gasPolicyId && sponsorGas) {
                this.provider = this.provider.withAlchemyGasManager({
                    policyId: gasPolicyId,
                    entryPoint: this.chain.entryPointAddress,
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
    initAlchemyProvider() {
        this.provider = new aa_alchemy_1.AlchemyProvider({
            chain: this.chain.chainId,
            entryPointAddress: this.chain.entryPointAddress,
            apiKey: this.smartWalletProviderInfo.apiKeys[`alchemyKey-${this.chain.name.toLowerCase()}`],
        }).connect((rpcClient) => new aa_core_1.SimpleSmartContractAccount({
            owner: this.simpleAccountOwner,
            entryPointAddress: this.chain.entryPointAddress,
            chain: (0, chains_1.getAlchemyChain)(this.chain),
            factoryAddress: this.chain.factoryAddress,
            rpcClient,
        }));
        return this.provider;
    }
    async waitForUserOperationTransaction(hash) {
        try {
            return await this.provider.waitForUserOperationTransaction(hash);
        }
        catch (error) {
            return Promise.reject(`waitForUserOperationTransaction failed ${error}`);
        }
    }
    async getUserOperationByHash(hash) {
        try {
            return await this.provider.getUserOperationByHash(hash);
        }
        catch (error) {
            return Promise.reject(`getUserOperationByHash failed ${error}`);
        }
    }
    async getUserOperationReceipt(hash) {
        try {
            return await this.provider.getUserOperationReceipt(hash);
        }
        catch (error) {
            return Promise.reject(`getUserOperationByHash failed ${error}`);
        }
    }
}
exports.AlchemySmartWallet = AlchemySmartWallet;
