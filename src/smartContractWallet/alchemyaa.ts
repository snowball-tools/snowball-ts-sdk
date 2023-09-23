import {
  type Address,
  type SendUserOperationResult,
  type Hex,
  type SimpleSmartAccountOwner,
  BaseSmartContractAccount,
  type BatchUserOperationCallData,
  type FeeDataMiddleware,
  type GasEstimatorMiddleware,
  type PaymasterAndDataMiddleware,
  type SignTypedDataParams,
  type UserOperationCallData,
  type UserOperationReceipt,
  type UserOperationResponse,
  type UserOperationStruct,
  type AccountMiddlewareFn,
  type PublicErc4337Client,
} from "@alchemy/aa-core";
import { retry } from "../helpers/promise";
import type { SnowballAuth } from "../main/Snowball";
import type { Transport, RpcTransactionRequest } from "viem";
import type { SignTypedDataParameters } from "viem/accounts";
import { SmartContractWallet } from "./SmartContractWallet";
import type { AAProvider } from "../helpers/constants";

export class AlchemyAA extends SmartContractWallet {
  private gasPolicyId: string | undefined;

  constructor(
    auth: SnowballAuth,
    simpleAccountOwner: SimpleSmartAccountOwner,
    aaProvider: AAProvider
  ) {
    super(auth, simpleAccountOwner, aaProvider);
    this.auth = auth;
    this.gasPolicyId =
      this.aaProvider.apiKeys[`alchemyKey-${auth.chain.name.toLowerCase()}-gasPolicyId`];
  }

  async sendUserOperation(
    data: UserOperationCallData | BatchUserOperationCallData
  ): Promise<SendUserOperationResult> {
    return await this.provider.sendUserOperation(data);
  }

  async buildUserOperation(
    data: UserOperationCallData | BatchUserOperationCallData
  ): Promise<UserOperationStruct> {
    return await this.provider.buildUserOperation(data);
  }

  async buildUserOperationFromTx(
    tx: RpcTransactionRequest
  ): Promise<UserOperationStruct> {
    return await this.provider.buildUserOperationFromTx(tx);
  }

  async waitForUserOperationTransaction(
    hash: `0x${string}`
  ): Promise<`0x${string}`> {
    return await this.provider.waitForUserOperationTransaction(hash);
  }

  async getUserOperationByHash(
    hash: `0x${string}`
  ): Promise<UserOperationResponse | null> {
    return await this.provider.getUserOperationByHash(hash);
  }

  async getUserOperationReceipt(
    hash: `0x${string}`
  ): Promise<UserOperationReceipt | null> {
    return await this.provider.getUserOperationReceipt(hash);
  }

  async sendTransaction(
    request: RpcTransactionRequest
  ): Promise<`0x${string}`> {
    return await this.provider.sendTransaction(request);
  }

  async sendTransactions(
    request: RpcTransactionRequest[]
  ): Promise<`0x${string}`> {
    return await this.provider.sendTransactions(request);
  }

  async request(args: {
    method: string;
    params?: any[] | undefined;
  }): Promise<any> {
    return await this.provider.request(args);
  }

  async signMessage(msg: string | Uint8Array): Promise<`0x${string}`> {
    return await this.provider.signMessage(msg);
  }

  async signTypedData(params: SignTypedDataParameters): Promise<`0x${string}`> {
    return await this.provider.signTypedData(params);
  }

  async signMessageWith6492(msg: string | Uint8Array): Promise<`0x${string}`> {
    return await this.provider.signMessageWith6492(msg);
  }

  async signTypedDataWith6492(
    params: SignTypedDataParams
  ): Promise<`0x${string}`> {
    return await this.provider.signTypedDataWith6492(params);
  }

  async getAddress(): Promise<`0x${string}`> {
    return await this.provider.getAddress();
  }

  withPaymasterMiddleware(overrides: {
    dummyPaymasterDataMiddleware?: PaymasterAndDataMiddleware | undefined;
    paymasterDataMiddleware?: PaymasterAndDataMiddleware | undefined;
  }): this {
    this.provider.withPaymasterMiddleware(overrides);
    return this;
  }

  withGasEstimator(override: GasEstimatorMiddleware): this {
    this.provider.withGasEstimator(override);
    return this;
  }

  withFeeDataGetter(override: FeeDataMiddleware): this {
    this.provider.withFeeDataGetter(override);
    return this;
  }

  withCustomMiddleware(override: AccountMiddlewareFn): this {
    this.provider.withCustomMiddleware(override);
    return this;
  }

  connect(
    fn: (
      provider: PublicErc4337Client<Transport>
    ) => BaseSmartContractAccount<Transport>
  ): this & { account: BaseSmartContractAccount<Transport> } {
    this.provider.connect(fn);
    this.account = this.provider.account;
    return this as this & { account: BaseSmartContractAccount<Transport> };
  }

  disconnect(): this & { account: undefined } {
    this.provider.disconnect();
    this.account = this.provider.account;
    return this as this & { account: undefined };
  }

  async sendUserOp(
    targetAddress: Address,
    data: Hex,
    sponsorGas: Boolean
  ): Promise<SendUserOperationResult> {
    try {
      if (this.gasPolicyId !== undefined && sponsorGas) {
        this.provider.withAlchemyGasManager({
          policyId: this.gasPolicyId,
          entryPoint: this.auth.chain.entryPointAddress,
        });
      }

      const result: SendUserOperationResult = await this.sendUserOperation({
        target: targetAddress,
        data: data,
      });

      if (result === undefined || result.hash === undefined) {
        return Promise.reject("Transaction failed");
      }

      // wait for user op
      await retry(
        this.waitForUserOperationTransaction,
        [result.hash as Address],
        10
      );

      let userOpReceipt = await retry(
        this.getUserOperationReceipt,
        [result.hash as Address],
        10
      );

      if (userOpReceipt === null) {
        return Promise.reject("Transaction failed");
      }

      return result;
    } catch (error) {
      return Promise.reject(`Transaction failed ${error}`);
    }
  }
}
