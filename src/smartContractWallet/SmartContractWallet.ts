import {
  type SendUserOperationResult,
  type AccountMiddlewareFn,
  type BaseSmartContractAccount,
  type UserOperationCallData,
  type BatchUserOperationCallData,
  type UserOperationStruct,
  type UserOperationResponse,
  type UserOperationReceipt,
  type SignTypedDataParams,
  type PaymasterAndDataMiddleware,
  type GasEstimatorMiddleware,
  type FeeDataMiddleware,
  type PublicErc4337Client,
  type SimpleSmartAccountOwner,
  SimpleSmartContractAccount,
} from "@alchemy/aa-core";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import type { Transport, RpcTransactionRequest, Address } from "viem";
import type { SignTypedDataParameters } from "viem/accounts";
import {
  viemChain,
  type SnowballAuth,
  type SnowballSmartWallet,
  type AAProvider,
} from "..";

export class SmartContractWallet implements SnowballSmartWallet {
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

  constructor(
    auth: SnowballAuth,
    simpleAccountOwner: SimpleSmartAccountOwner,
    aaProvider: AAProvider
  ) {
    this.auth = auth;
    this.simpleAccountOwner = simpleAccountOwner;
    this.aaProvider = aaProvider;

    this.provider = new AlchemyProvider({
      chain: viemChain(auth.chain),
      entryPointAddress: auth.chain.entryPointAddress,
      apiKey: aaProvider.apiKeys[`alchemyKey-${auth.chain.name.toLowerCase()}`],
    }).connect(
      (rpcClient) =>
        new SimpleSmartContractAccount({
          owner: simpleAccountOwner,
          entryPointAddress: this.auth.chain.entryPointAddress,
          chain: viemChain(this.auth.chain),
          factoryAddress: this.auth.chain.factoryAddress,
          rpcClient,
        })
    );

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

  sendUserOp(
    targetAddress: `0x${string}`,
    data: `0x${string}`,
    sponsorGas: Boolean
  ): Promise<SendUserOperationResult> {
    throw new Error("Method not implemented.");
  }

  async sendUserOperation(
    data: UserOperationCallData | BatchUserOperationCallData
  ): Promise<SendUserOperationResult> {
    throw new Error("Method not implemented.");
  }

  async buildUserOperation(
    data: UserOperationCallData | BatchUserOperationCallData
  ): Promise<UserOperationStruct> {
    throw new Error("Method not implemented.");
  }

  async buildUserOperationFromTx(
    tx: RpcTransactionRequest
  ): Promise<UserOperationStruct> {
    throw new Error("Method not implemented.");
  }

  async waitForUserOperationTransaction(
    hash: `0x${string}`
  ): Promise<`0x${string}`> {
    throw new Error("Method not implemented.");
  }

  async getUserOperationByHash(
    hash: `0x${string}`
  ): Promise<UserOperationResponse | null> {
    throw new Error("Method not implemented.");
  }

  getUserOperationReceipt(
    hash: `0x${string}`
  ): Promise<UserOperationReceipt | null> {
    throw new Error("Method not implemented.");
  }

  sendTransaction(request: RpcTransactionRequest): Promise<`0x${string}`> {
    throw new Error("Method not implemented.");
  }

  sendTransactions(request: RpcTransactionRequest[]): Promise<`0x${string}`> {
    throw new Error("Method not implemented.");
  }

  request(args: { method: string; params?: any[] | undefined }): Promise<any> {
    throw new Error("Method not implemented.");
  }

  signMessage(msg: string | Uint8Array): Promise<`0x${string}`> {
    throw new Error("Method not implemented.");
  }

  signTypedData(params: SignTypedDataParameters): Promise<`0x${string}`> {
    throw new Error("Method not implemented.");
  }

  signMessageWith6492(msg: string | Uint8Array): Promise<`0x${string}`> {
    throw new Error("Method not implemented.");
  }

  signTypedDataWith6492(params: SignTypedDataParams): Promise<`0x${string}`> {
    throw new Error("Method not implemented.");
  }

  getAddress(): Promise<`0x${string}`> {
    throw new Error("Method not implemented.");
  }

  withPaymasterMiddleware(overrides: {
    dummyPaymasterDataMiddleware?: PaymasterAndDataMiddleware | undefined;
    paymasterDataMiddleware?: PaymasterAndDataMiddleware | undefined;
  }): this {
    throw new Error("Method not implemented.");
  }

  withGasEstimator(override: GasEstimatorMiddleware): this {
    throw new Error("Method not implemented.");
  }

  withFeeDataGetter(override: FeeDataMiddleware): this {
    throw new Error("Method not implemented.");
  }

  withCustomMiddleware(override: AccountMiddlewareFn): this {
    throw new Error("Method not implemented.");
  }

  connect(
    fn: (
      provider: PublicErc4337Client<Transport>
    ) => BaseSmartContractAccount<Transport>
  ): this & { account: BaseSmartContractAccount<Transport> } {
    throw new Error("Method not implemented.");
  }
  disconnect(): this & { account: undefined } {
    throw new Error("Method not implemented.");
  }
}
