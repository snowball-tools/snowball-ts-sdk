import { viemChain } from "../helpers/chains";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { retry } from "../helpers/promise";
// import { Alchemy } from "alchemy-sdk";
export class AlchemyAA extends AlchemyProvider {
    constructor(auth, apiKey, gasPolicyId) {
        super({
            chain: viemChain(auth.chain),
            entryPointAddress: auth.chain.entryPointAddress,
            apiKey: apiKey,
        });
        Object.defineProperty(this, "auth", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // private simpleAccountOwner: SimpleSmartAccountOwner | undefined;
        // private address: Address | undefined;
        // private apiKey: string;
        // private alchemy: Alchemy;
        Object.defineProperty(this, "gasPolicyId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.auth = auth;
        // this.apiKey = apiKey;
        this.gasPolicyId = gasPolicyId;
        // this.alchemy = new Alchemy({
        //   apiKey: apiKey,
        //   network: getAlchemyNetwork(this.auth.chain),
        // });
    }
    async sendUserOp(targetAddress, data, sponsorGas) {
        try {
            if (this.gasPolicyId !== undefined && sponsorGas) {
                this.withAlchemyGasManager({
                    policyId: this.gasPolicyId,
                    entryPoint: this.auth.chain.entryPointAddress,
                });
            }
            const result = await this.sendUserOperation({
                target: targetAddress,
                data: data,
            });
            if (result === undefined || result.hash === undefined) {
                return Promise.reject("Transaction failed");
            }
            // wait for user op
            await retry(this.waitForUserOperationTransaction, [result.hash], 10);
            let userOpReceipt = await retry(this.getUserOperationReceipt, [result.hash], 10);
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
//# sourceMappingURL=alchemyaa.js.map