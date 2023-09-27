import { SimpleSmartContractAccount, } from "@alchemy/aa-core";
import { retry } from "../../helpers/promise";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { getAlchemyChain } from "../../helpers/chains";
export class AlchemySmartWallet {
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
            await retry(this.provider.waitForUserOperationTransaction, [result.hash], 10);
            let userOpReceipt = await retry(this.provider.getUserOperationReceipt, [result.hash], 10);
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
        this.provider = new AlchemyProvider({
            chain: this.chain.chainId,
            entryPointAddress: this.chain.entryPointAddress,
            apiKey: this.smartWalletProviderInfo.apiKeys[`alchemyKey-${this.chain.name.toLowerCase()}`],
        }).connect((rpcClient) => new SimpleSmartContractAccount({
            owner: this.simpleAccountOwner,
            entryPointAddress: this.chain.entryPointAddress,
            chain: getAlchemyChain(this.chain),
            factoryAddress: this.chain.factoryAddress,
            rpcClient,
        }));
        return this.provider;
    }
}
//# sourceMappingURL=AlchemySmartWallet.js.map