import {
  type Address,
  type SendUserOperationResult,
  type Hex,
  SimpleSmartContractAccount,
  UserOperationResponse,
  UserOperationReceipt,
} from "@alchemy/aa-core";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { getAlchemyChain } from "../helpers/chains";
// TODO: make sure there are no operations on smart wallet in this entity
//import { SmartWallet } from "./SmartWallet";
import { BaseAccountSmartWallet } from "./BaseAccountSmartWallet";

export class AlchemySmartWallet extends BaseAccountSmartWallet {
  private provider: AlchemyProvider | undefined;

  async getAddress(): Promise<Address> {
    if (this.address) {
      return this.address;
    }

    try {
      const baseAccount = await super.getBaseAccount();
      this.address = await baseAccount.getAddress();
      return this.address;
    } catch (error) {
      throw new Error(`Error getting address ${JSON.stringify(error)}`);
    }
  }

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

  private async initAlchemyProvider(): Promise<AlchemyProvider> {
    try {
      const owner = await this.getBaseAccount();
      this.provider = new AlchemyProvider({
        chain: super.chain.chainId,
        entryPointAddress: super.chain.entryPointAddress,
        apiKey:
          this.smartWalletProviderInfo.apiKeys[
            `alchemyKey-${super.chain.name.toLowerCase()}`
          ],
      }).connect(
        (rpcClient) =>
          new SimpleSmartContractAccount({
            owner: owner,
            entryPointAddress: super.chain.entryPointAddress,
            chain: getAlchemyChain(super.chain),
            factoryAddress: super.chain.factoryAddress,
            rpcClient,
          })
      );
      return this.provider;
    } catch (error) {
      return Promise.reject(
        `initAlchemyProvider failed ${JSON.stringify(error)}`
      );
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
