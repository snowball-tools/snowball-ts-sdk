import {
  type Address,
  type SendUserOperationResult,
  type Hex,
  UserOperationResponse,
  UserOperationReceipt,
} from "@alchemy/aa-core";

import { AlchemyProvider } from "@alchemy/aa-alchemy";

import { BaseAccountSmartWalletWrapper } from "./BaseAccountSmartWalletWrapper";

export class AlchemySmartWallet extends BaseAccountSmartWalletWrapper {
  private provider: AlchemyProvider | undefined;

  async sendUserOperation(
    targetAddress: Address,
    data: Hex,
    sponsorGas: boolean
  ): Promise<SendUserOperationResult> {
    try {
      this.provider = this.provider
        ? this.provider
        : await this.initAlchemyProvider();

      const gasPolicyId =
        this.smartWalletProviderInfo.apiKeys[
          `alchemyKey-${super.chain.name.toLowerCase()}-gasPolicyId`
        ];

      if (gasPolicyId && sponsorGas) {
        this.provider = this.provider.withAlchemyGasManager({
          policyId: gasPolicyId,
          entryPoint: super.chain.entryPointAddress,
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

  async waitForUserOperationTransaction(
    hash: `0x${string}`
  ): Promise<`0x${string}`> {
    try {
      this.provider = this.provider
        ? this.provider
        : await this.initAlchemyProvider();

      return await this.provider.waitForUserOperationTransaction(hash);
    } catch (error) {
      return Promise.reject(
        `waitForUserOperationTransaction failed ${JSON.stringify(error)}`
      );
    }
  }

  async getUserOperationByHash(
    hash: `0x${string}`
  ): Promise<UserOperationResponse> {
    try {
      this.provider = this.provider
        ? this.provider
        : await this.initAlchemyProvider();

      return await this.provider.getUserOperationByHash(hash);
    } catch (error) {
      return Promise.reject(
        `getUserOperationByHash failed ${JSON.stringify(error)}`
      );
    }
  }

  async getUserOperationReceipt(
    hash: `0x${string}`
  ): Promise<UserOperationReceipt> {
    try {
      this.provider = this.provider
        ? this.provider
        : await this.initAlchemyProvider();

      return await this.provider.getUserOperationReceipt(hash);
    } catch (error) {
      return Promise.reject(
        `getUserOperationByHash failed ${JSON.stringify(error)}`
      );
    }
  }

  async switchChain(): Promise<void> {
    try {
      this.provider = await this.initAlchemyProvider();
    } catch (error) {
      return Promise.reject(`changeChain failed ${JSON.stringify(error)}`);
    }
  }
}
