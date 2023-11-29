import {
  type Address,
  type SendUserOperationResult,
  type Hex,
  SimpleSmartContractAccount,
  UserOperationResponse,
  UserOperationReceipt,
  BaseSmartContractAccount,
} from "@alchemy/aa-core";
import {
  LightSmartContractAccount,
  getDefaultLightAccountFactoryAddress,
} from "@alchemy/aa-accounts";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { getAlchemyChain } from "../helpers/chains";
// TODO: make sure there are no operations on smart wallet in this entity
//import { SmartWallet } from "./SmartWallet";
import { BaseAccountSmartWallet } from "./BaseAccountSmartWallet";

export class AlchemySmartWallet extends BaseAccountSmartWallet {
  private provider: AlchemyProvider | undefined;

  // async getAccountOwner(): Promise<Address> {
  //   if (this.address) {
  //     return this.address;
  //   }

  //   try {
  //     const baseAccount = await super.getBaseAccount();
  //     this.address = await baseAccount.getAddress();
  //     return this.address;
  //   } catch (error) {
  //     throw new Error(`Error getting address ${JSON.stringify(error)}`);
  //   }
  // }

  private async initAlchemyProvider(): Promise<AlchemyProvider> {
    // Create a provider to send user operations from your smart account
    const provider = new AlchemyProvider({
      // get your Alchemy API key at https://dashboard.alchemy.com
      apiKey: "ALCHEMY_API_KEY",
      chain: getAlchemyChain(this.chain),
    }).connect(
      (rpcClient) =>
        new LightSmartContractAccount({
          rpcClient: rpcClient,
          owner: this.getAccountSigner(),
          chain: getAlchemyChain(this.chain),
          factoryAddress: getDefaultLightAccountFactoryAddress(chain),
        })
    );

    return provider;
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

  // private async initAlchemyProvider(): Promise<AlchemyProvider> {
  //   try {
  //     this.provider = new AlchemyProvider({
  //       chain: super.chain.chainId,
  //       entryPointAddress: super.chain.entryPointAddress,
  //       apiKey:
  //         this.smartWalletProviderInfo.apiKeys[
  //           `alchemyKey-${super.chain.name.toLowerCase()}`
  //         ],
  //     }).connect((provider) => {
  //       return new LightSmartContractAccount({
  //         owner: null, // Replace with the actual owner value
  //         chain: super.chain, // Replace with the actual chain value
  //         rpcClient: rpcClient, // Replace with the actual rpcClient value
  //         factoryAddress: null, // Replace with the actual factoryAddress value
  //       }) as unknown as BaseSmartContractAccount;
  //     });
  //     return this.provider;
  //   } catch (error) {
  //     throw new Error(`initAlchemyProvider failed ${JSON.stringify(error)}`);
  //   }
  // }

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
