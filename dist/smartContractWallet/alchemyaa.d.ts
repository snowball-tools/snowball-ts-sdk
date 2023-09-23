import { type Address, type SendUserOperationResult, type Hex, type SimpleSmartAccountOwner, BaseSmartContractAccount, type BatchUserOperationCallData, type FeeDataMiddleware, type GasEstimatorMiddleware, type PaymasterAndDataMiddleware, type SignTypedDataParams, type UserOperationCallData, type UserOperationReceipt, type UserOperationResponse, type UserOperationStruct, type AccountMiddlewareFn, type PublicErc4337Client } from "@alchemy/aa-core";
import type { SnowballAuth } from "../main/Snowball";
import type { Transport, RpcTransactionRequest } from "viem";
import type { SignTypedDataParameters } from "viem/accounts";
import { SmartContractWallet } from "./SmartContractWallet";
import type { AAProvider } from "../helpers/constants";
export declare class AlchemyAA extends SmartContractWallet {
    private gasPolicyId;
    constructor(auth: SnowballAuth, simpleAccountOwner: SimpleSmartAccountOwner, aaProvider: AAProvider);
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
    sendUserOp(targetAddress: Address, data: Hex, sponsorGas: Boolean): Promise<SendUserOperationResult>;
}
