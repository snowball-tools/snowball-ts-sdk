"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlchemySmartWallet = void 0;
const aa_core_1 = require("@alchemy/aa-core");
const promise_1 = require("../../helpers/promise");
const aa_alchemy_1 = require("@alchemy/aa-alchemy");
const chains_1 = require("../../helpers/chains");
class AlchemySmartWallet {
    constructor(simpleAccountOwner, smartWalletProviderInfo, chain) {
        Object.defineProperty(this, "provider", {
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
        Object.defineProperty(this, "smartWalletProviderInfo", {
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
            await (0, promise_1.retry)(this.provider.waitForUserOperationTransaction, [result.hash], 10);
            let userOpReceipt = await (0, promise_1.retry)(this.provider.getUserOperationReceipt, [result.hash], 10);
            if (userOpReceipt === null) {
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
}
exports.AlchemySmartWallet = AlchemySmartWallet;
//# sourceMappingURL=AlchemySmartWallet.js.map