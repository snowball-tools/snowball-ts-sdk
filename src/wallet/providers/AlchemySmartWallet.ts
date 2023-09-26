import {
  type Address,
  type SendUserOperationResult,
  type Hex,
  type SimpleSmartAccountOwner,
  SimpleSmartContractAccount,
} from "@alchemy/aa-core";
import { retry } from "../../helpers/promise";
import { viemChain, type Chain } from "../../helpers/chains";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import type { SmartWalletProviderInfo } from "../../helpers/constants";
import type { SnowballSmartWalletProvider } from "./SnowballSmartWalletProvider";

export class AlchemySmartWallet implements SnowballSmartWalletProvider {
  private gasPolicyId: string | undefined;
  private provider: AlchemyProvider;
  chain: Chain;
  smartWalletProviderInfo: SmartWalletProviderInfo;

  constructor(
    simpleAccountOwner: SimpleSmartAccountOwner,
    smartWalletProviderInfo: SmartWalletProviderInfo,
    chain: Chain
  ) {
    this.chain = chain;
    this.smartWalletProviderInfo = smartWalletProviderInfo;
    this.gasPolicyId =
      this.smartWalletProviderInfo.apiKeys[
        `alchemyKey-${chain.name.toLowerCase()}-gasPolicyId`
      ];

    this.provider = new AlchemyProvider({
      chain: viemChain(chain),
      entryPointAddress: chain.entryPointAddress,
      apiKey:
        smartWalletProviderInfo.apiKeys[
          `alchemyKey-${chain.name.toLowerCase()}`
        ],
    }).connect(
      (rpcClient) =>
        new SimpleSmartContractAccount({
          owner: simpleAccountOwner,
          entryPointAddress: chain.entryPointAddress,
          chain: viemChain(chain),
          factoryAddress: chain.factoryAddress,
          rpcClient,
        })
    );
  }

  async sendUserOperation(
    targetAddress: Address,
    data: Hex,
    sponsorGas: Boolean
  ): Promise<SendUserOperationResult> {
    try {
      if (this.gasPolicyId !== undefined && sponsorGas) {
        this.provider = this.provider.withAlchemyGasManager({
          policyId: this.gasPolicyId,
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

      // wait for user op
      await retry(
        this.provider.waitForUserOperationTransaction,
        [result.hash as Address],
        10
      );

      let userOpReceipt = await retry(
        this.provider.getUserOperationReceipt,
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
