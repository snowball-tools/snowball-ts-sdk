import {
  type Address,
  type SendUserOperationResult,
  type Hex,
  type SimpleSmartAccountOwner,
  SimpleSmartContractAccount,
  UserOperationResponse,
  UserOperationReceipt,
} from "@alchemy/aa-core";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import type { SmartWalletProviderInfo } from "../../helpers/constants";
import type { SnowballSmartWalletProvider } from "./types";
import { Chain } from "../../helpers";
import { getAlchemyChain } from "../../helpers/chains";

export class AlchemySmartWallet implements SnowballSmartWalletProvider {
  private provider: AlchemyProvider;
  chain: Chain;
  smartWalletProviderInfo: SmartWalletProviderInfo;
  simpleAccountOwner: SimpleSmartAccountOwner;

  constructor(
    simpleAccountOwner: SimpleSmartAccountOwner,
    smartWalletProviderInfo: SmartWalletProviderInfo,
    chain: Chain
  ) {
    this.chain = chain;
    this.smartWalletProviderInfo = smartWalletProviderInfo;
    this.simpleAccountOwner = simpleAccountOwner;

    this.provider = this.initAlchemyProvider();
  }

  changeChain(chain: Chain) {
    this.chain = chain;
    this.provider = this.initAlchemyProvider();
  }

  async sendUserOperation(
    targetAddress: Address,
    data: Hex,
    sponsorGas: Boolean
  ): Promise<SendUserOperationResult> {
    try {
      const gasPolicyId =
        this.smartWalletProviderInfo.apiKeys[
          `alchemyKey-${this.chain.name.toLowerCase()}-gasPolicyId`
        ];

      if (gasPolicyId && sponsorGas) {
        this.provider = this.provider.withAlchemyGasManager({
          policyId: gasPolicyId,
          entryPoint: this.chain.entryPointAddress,
        });
      }

      const result: SendUserOperationResult =
        await this.provider.sendUserOperation({
          target: targetAddress,
          data: data,
        });

      if (result === undefined || result.hash === undefined) {
        return Promise.reject("Transaction failed");
      }

      return result;
    } catch (error) {
      return Promise.reject(`Transaction failed ${JSON.stringify(error)}`);
    }
  }

  private initAlchemyProvider(): AlchemyProvider {
    this.provider = new AlchemyProvider({
      chain: this.chain.chainId,
      entryPointAddress: this.chain.entryPointAddress,
      apiKey:
        this.smartWalletProviderInfo.apiKeys[
          `alchemyKey-${this.chain.name.toLowerCase()}`
        ],
    }).connect(
      (rpcClient) =>
        new SimpleSmartContractAccount({
          owner: this.simpleAccountOwner,
          entryPointAddress: this.chain.entryPointAddress,
          chain: getAlchemyChain(this.chain),
          factoryAddress: this.chain.factoryAddress,
          rpcClient,
        })
    );
    return this.provider;
  }

  async waitForUserOperationTransaction(
    hash: `0x${string}`
  ): Promise<`0x${string}`> {
    try {
      return await this.provider.waitForUserOperationTransaction(hash);
    } catch (error) {
      return Promise.reject(`waitForUserOperationTransaction failed ${error}`);
    }
  }

  async getUserOperationByHash(
    hash: `0x${string}`
  ): Promise<UserOperationResponse> {
    try {
      return await this.provider.getUserOperationByHash(hash);
    } catch (error) {
      return Promise.reject(`getUserOperationByHash failed ${error}`);
    }
  }

  async getUserOperationReceipt(
    hash: `0x${string}`
  ): Promise<UserOperationReceipt> {
    try {
      return await this.provider.getUserOperationReceipt(hash);
    } catch (error) {
      return Promise.reject(`getUserOperationByHash failed ${error}`);
    }
  }
}
