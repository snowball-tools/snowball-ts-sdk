import { type SendUserOperationResult, type AccountMiddlewareFn, type BaseSmartContractAccount, type UserOperationCallData, type BatchUserOperationCallData, type UserOperationStruct, type UserOperationResponse, type UserOperationReceipt, type SignTypedDataParams, type PaymasterAndDataMiddleware, type GasEstimatorMiddleware, type FeeDataMiddleware, type PublicErc4337Client, type SimpleSmartAccountOwner } from "@alchemy/aa-core";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import type { Transport, RpcTransactionRequest, Address } from "viem";
import type { SignTypedDataParameters } from "viem/accounts";
import { type SnowballAuth, type SnowballSmartWallet, type AAProvider } from "..";
export declare class SmartContractWallet implements SnowballSmartWallet {
    auth: SnowballAuth;
    rpcClient: PublicErc4337Client<Transport>;
    dummyPaymasterDataMiddleware: AccountMiddlewareFn;
    paymasterDataMiddleware: AccountMiddlewareFn;
    gasEstimator: AccountMiddlewareFn;
    feeDataGetter: AccountMiddlewareFn;
    customMiddleware?: AccountMiddlewareFn | undefined;
    account?: BaseSmartContractAccount<Transport> | undefined;
    provider: AlchemyProvider;
    simpleAccountOwner: SimpleSmartAccountOwner | undefined;
    address: Address | undefined;
    aaProvider: AAProvider;
    constructor(auth: SnowballAuth, simpleAccountOwner: SimpleSmartAccountOwner, aaProvider: AAProvider);
    sendUserOp(targetAddress: `0x${string}`, data: `0x${string}`, sponsorGas: Boolean): Promise<SendUserOperationResult>;
    sendUserOperation(data: UserOperationCallData | BatchUserOperationCallData): Promise<SendUserOperationResult>;
    buildUserOperation(data: UserOperationCallData | BatchUserOperationCallData): Promise<UserOperationStruct>;
    buildUserOperationFromTx(tx: RpcTransactionRequest): Promise<UserOperationStruct>;
    waitForUserOperationTransaction(hash: `0x${string}`): Promise<`0x${string}`>;
    getUserOperationByHash(hash: `0x${string}`): Promise<UserOperationResponse | null>;
    getUserOperationReceipt(hash: `0x${string}`): Promise<UserOperationReceipt | null>;
    sendTransaction(request: RpcTransactionRequest): Promise<`0x${string}`>;
    sendTransactions(request: RpcTransactionRequest[]): Promise<`0x${string}`>;
    request(args: {
        method: string;
        params?: any[] | undefined;
    }): Promise<any>;
    signMessage(msg: string | Uint8Array): Promise<`0x${string}`>;
    signTypedData(params: SignTypedDataParameters): Promise<`0x${string}`>;
    signMessageWith6492(msg: string | Uint8Array): Promise<`0x${string}`>;
    signTypedDataWith6492(params: SignTypedDataParams): Promise<`0x${string}`>;
    getAddress(): Promise<`0x${string}`>;
    withPaymasterMiddleware(overrides: {
        dummyPaymasterDataMiddleware?: PaymasterAndDataMiddleware | undefined;
        paymasterDataMiddleware?: PaymasterAndDataMiddleware | undefined;
    }): this;
    withGasEstimator(override: GasEstimatorMiddleware): this;
    withFeeDataGetter(override: FeeDataMiddleware): this;
    withCustomMiddleware(override: AccountMiddlewareFn): this;
    connect(fn: (provider: PublicErc4337Client<Transport>) => BaseSmartContractAccount<Transport>): this & {
        account: BaseSmartContractAccount<Transport>;
    };
    disconnect(): this & {
        account: undefined;
    };
}
