import { BaseSmartContractAccount, } from "@alchemy/aa-core";
import { retry } from "../helpers/promise";
import { SmartContractWallet } from "./SmartContractWallet";
export class AlchemyAA extends SmartContractWallet {
    gasPolicyId;
    constructor(auth, simpleAccountOwner, aaProvider) {
        super(auth, simpleAccountOwner, aaProvider);
        this.auth = auth;
        this.gasPolicyId =
            this.aaProvider.apiKeys[`alchemyKey-${auth.chain.name.toLowerCase()}-gasPolicyId`];
        console.log(this.aaProvider.apiKeys[`alchemyKey-${auth.chain.name.toLowerCase()}-gasPolicyId`]);
    }
    async sendUserOp(targetAddress, data, sponsorGas) {
        try {
            if (this.gasPolicyId !== undefined && sponsorGas) {
                this.provider = this.provider.withAlchemyGasManager({
                    policyId: this.gasPolicyId,
                    entryPoint: this.auth.chain.entryPointAddress,
                });
            }
            const result = await this.provider.sendUserOperation({
                target: targetAddress,
                data: data,
            });
            if (result === undefined || result.hash === undefined) {
                return Promise.reject("Transaction failed");
            }
            // wait for user op
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
//# sourceMappingURL=AlchemyAA.js.map