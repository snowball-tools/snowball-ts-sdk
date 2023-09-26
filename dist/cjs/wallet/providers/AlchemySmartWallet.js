"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlchemySmartWallet = void 0;
const aa_core_1 = require("@alchemy/aa-core");
const promise_1 = require("../../helpers/promise");
const chains_1 = require("../../helpers/chains");
const aa_alchemy_1 = require("@alchemy/aa-alchemy");
class AlchemySmartWallet {
    constructor(simpleAccountOwner, smartWalletProviderInfo, chain) {
        Object.defineProperty(this, "gasPolicyId", {
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
        this.chain = chain;
        this.smartWalletProviderInfo = smartWalletProviderInfo;
        this.gasPolicyId =
            this.smartWalletProviderInfo.apiKeys[`alchemyKey-${chain.name.toLowerCase()}-gasPolicyId`];
        this.provider = new aa_alchemy_1.AlchemyProvider({
            chain: (0, chains_1.viemChain)(chain),
            entryPointAddress: chain.entryPointAddress,
            apiKey: smartWalletProviderInfo.apiKeys[`alchemyKey-${chain.name.toLowerCase()}`],
        }).connect((rpcClient) => new aa_core_1.SimpleSmartContractAccount({
            owner: simpleAccountOwner,
            entryPointAddress: chain.entryPointAddress,
            chain: (0, chains_1.viemChain)(chain),
            factoryAddress: chain.factoryAddress,
            rpcClient,
        }));
    }
    async sendUserOperation(targetAddress, data, sponsorGas) {
        try {
            if (this.gasPolicyId !== undefined && sponsorGas) {
                this.provider = this.provider.withAlchemyGasManager({
                    policyId: this.gasPolicyId,
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
            return Promise.reject(`Transaction failed ${error}`);
        }
    }
}
exports.AlchemySmartWallet = AlchemySmartWallet;
//# sourceMappingURL=AlchemySmartWallet.js.map