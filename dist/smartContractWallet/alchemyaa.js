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
    async sendUserOperation(data) {
        return await this.provider.sendUserOperation(data);
    }
    async buildUserOperation(data) {
        return await this.provider.buildUserOperation(data);
    }
    async buildUserOperationFromTx(tx) {
        return await this.provider.buildUserOperationFromTx(tx);
    }
    async waitForUserOperationTransaction(hash) {
        return await this.provider.waitForUserOperationTransaction(hash);
    }
    async getUserOperationByHash(hash) {
        return await this.provider.getUserOperationByHash(hash);
    }
    async getUserOperationReceipt(hash) {
        return await this.provider.getUserOperationReceipt(hash);
    }
    async sendTransaction(request) {
        return await this.provider.sendTransaction(request);
    }
    async sendTransactions(request) {
        return await this.provider.sendTransactions(request);
    }
    async request(args) {
        return await this.provider.request(args);
    }
    async signMessage(msg) {
        return await this.provider.signMessage(msg);
    }
    async signTypedData(params) {
        return await this.provider.signTypedData(params);
    }
    async signMessageWith6492(msg) {
        return await this.provider.signMessageWith6492(msg);
    }
    async signTypedDataWith6492(params) {
        return await this.provider.signTypedDataWith6492(params);
    }
    async getAddress() {
        return this.address ? this.address : await this.provider.getAddress();
    }
    withPaymasterMiddleware(overrides) {
        this.provider.withPaymasterMiddleware(overrides);
        return this;
    }
    withGasEstimator(override) {
        this.provider.withGasEstimator(override);
        return this;
    }
    withFeeDataGetter(override) {
        this.provider.withFeeDataGetter(override);
        return this;
    }
    withCustomMiddleware(override) {
        this.provider.withCustomMiddleware(override);
        return this;
    }
    connect(fn) {
        this.provider.connect(fn);
        this.account = this.provider.account;
        return this;
    }
    disconnect() {
        this.provider.disconnect();
        this.account = this.provider.account;
        return this;
    }
    async sendUserOp(targetAddress, data, sponsorGas) {
        try {
            if (this.gasPolicyId !== undefined && sponsorGas) {
                this.provider = this.provider.withAlchemyGasManager({
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
//# sourceMappingURL=AlchemyAA.js.map