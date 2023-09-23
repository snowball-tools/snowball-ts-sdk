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
import { Auth } from "../helpers/constants";
import {
  viemChain,
  type SnowballAuth,
  type SnowballSmartWallet,
  type AAProvider,
} from "..";

export class SmartContractWallet implements SnowballSmartWallet {
  auth: SnowballAuth;
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
  }

  async getAddress(): Promise<Address> {
    if (this.address !== undefined) {
      return this.address;
    }
    try {
      this.address = await this.provider.getAddress();
      return this.address;
    } catch (e) {
      throw new Error("Error getting address");
    }
  }

  async sendUserOp(
    targetAddress: Address,
    data: Address,
    sponsorGas: Boolean
  ): Promise<SendUserOperationResult> {
    throw new Error("Method not implemented.");
  }
}
