import { SimpleSmartContractAccount, } from "@alchemy/aa-core";
import { retry } from "../../helpers/promise";
import { viemChain } from "../../helpers/chains";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
export class AlchemySmartWallet {
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
        this.provider = new AlchemyProvider({
            chain: viemChain(chain),
            entryPointAddress: chain.entryPointAddress,
            apiKey: smartWalletProviderInfo.apiKeys[`alchemyKey-${chain.name.toLowerCase()}`],
        }).connect((rpcClient) => new SimpleSmartContractAccount({
            owner: simpleAccountOwner,
            entryPointAddress: chain.entryPointAddress,
            chain: viemChain(chain),
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
            await retry(this.provider.waitForUserOperationTransaction, [result.hash], 10);
            let userOpReceipt = await retry(this.provider.getUserOperationReceipt, [result.hash], 10);
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
//# sourceMappingURL=AlchemySmartWallet.js.map