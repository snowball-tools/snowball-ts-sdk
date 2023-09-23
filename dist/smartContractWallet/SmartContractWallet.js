import { SimpleSmartContractAccount, } from "@alchemy/aa-core";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { viemChain, } from "..";
export class SmartContractWallet {
    auth;
    rpcClient;
    dummyPaymasterDataMiddleware;
    paymasterDataMiddleware;
    gasEstimator;
    feeDataGetter;
    customMiddleware;
    account;
    provider;
    simpleAccountOwner;
    address;
    aaProvider;
    constructor(auth, simpleAccountOwner, aaProvider) {
        this.auth = auth;
        this.simpleAccountOwner = simpleAccountOwner;
        this.aaProvider = aaProvider;
        this.provider = new AlchemyProvider({
            chain: viemChain(auth.chain),
            entryPointAddress: auth.chain.entryPointAddress,
            apiKey: aaProvider.apiKeys[`alchemyKey-${auth.chain.name.toLowerCase()}`],
        }).connect((rpcClient) => new SimpleSmartContractAccount({
            owner: simpleAccountOwner,
            entryPointAddress: this.auth.chain.entryPointAddress,
            chain: viemChain(this.auth.chain),
            factoryAddress: this.auth.chain.factoryAddress,
            rpcClient,
        }));
        this.rpcClient = this.provider.rpcClient;
        this.dummyPaymasterDataMiddleware =
            this.provider.dummyPaymasterDataMiddleware;
        this.paymasterDataMiddleware = this.provider.paymasterDataMiddleware;
        this.gasEstimator = this.provider.gasEstimator;
        this.feeDataGetter = this.provider.feeDataGetter;
        this.customMiddleware = this.provider.customMiddleware;
        this.account = this.provider.account;
        this.provider
            .getAddress()
            .catch((e) => {
            throw e;
        })
            .then((address) => {
            this.address = address;
        });
    }
    sendUserOp(targetAddress, data, sponsorGas) {
        throw new Error("Method not implemented.");
    }
    async sendUserOperation(data) {
        throw new Error("Method not implemented.");
    }
    async buildUserOperation(data) {
        throw new Error("Method not implemented.");
    }
    async buildUserOperationFromTx(tx) {
        throw new Error("Method not implemented.");
    }
    async waitForUserOperationTransaction(hash) {
        throw new Error("Method not implemented.");
    }
    async getUserOperationByHash(hash) {
        throw new Error("Method not implemented.");
    }
    getUserOperationReceipt(hash) {
        throw new Error("Method not implemented.");
    }
    sendTransaction(request) {
        throw new Error("Method not implemented.");
    }
    sendTransactions(request) {
        throw new Error("Method not implemented.");
    }
    request(args) {
        throw new Error("Method not implemented.");
    }
    signMessage(msg) {
        throw new Error("Method not implemented.");
    }
    signTypedData(params) {
        throw new Error("Method not implemented.");
    }
    signMessageWith6492(msg) {
        throw new Error("Method not implemented.");
    }
    signTypedDataWith6492(params) {
        throw new Error("Method not implemented.");
    }
    getAddress() {
        throw new Error("Method not implemented.");
    }
    withPaymasterMiddleware(overrides) {
        throw new Error("Method not implemented.");
    }
    withGasEstimator(override) {
        throw new Error("Method not implemented.");
    }
    withFeeDataGetter(override) {
        throw new Error("Method not implemented.");
    }
    withCustomMiddleware(override) {
        throw new Error("Method not implemented.");
    }
    connect(fn) {
        throw new Error("Method not implemented.");
    }
    disconnect() {
        throw new Error("Method not implemented.");
    }
}
//# sourceMappingURL=SmartContractWallet.js.map