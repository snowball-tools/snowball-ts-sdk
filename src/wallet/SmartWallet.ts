import {
  UserOperationReceipt,
  UserOperationResponse,
  type Address,
  type SignTypedDataParams,
  type SimpleSmartAccountOwner,
} from "@alchemy/aa-core";
import type { TypedDataField } from "ethers";
import { AlchemySmartWallet } from "./providers/AlchemySmartWallet";
import type { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import type { SnowballAuth, SnowballSmartWallet } from "../snowball";
import { SmartWalletProvider, type SmartWalletProviderInfo } from "../helpers";
import type { SnowballSmartWalletProvider } from "./providers/types";

export class SmartWallet implements SnowballSmartWallet {
  smartWalletProvider: SnowballSmartWalletProvider | undefined;
  ethersWallet: PKPEthersWallet;
  auth: SnowballAuth;
  simpleAccountOwner: SimpleSmartAccountOwner | undefined;
  address: Address | undefined;
  smartWalletProviderInfo: SmartWalletProviderInfo;

  constructor(
    ethersWallet: PKPEthersWallet,
    auth: SnowballAuth,
    smartWalletProviderInfo: SmartWalletProviderInfo
  ) {
    this.auth = auth;
    this.smartWalletProviderInfo = smartWalletProviderInfo;
    this.ethersWallet = ethersWallet;
  }

  async getSimpleAccountOwner(): Promise<SimpleSmartAccountOwner> {
    try {
      const owner: SimpleSmartAccountOwner = {
        signMessage: async (msg: Uint8Array) => {
          return (await this.ethersWallet.signMessage(msg)) as Address;
        },
        getAddress: async () => {
          return (await this.ethersWallet.getAddress()) as Address;
        },
        signTypedData: async (params: SignTypedDataParams) => {
          const types: Record<string, Array<TypedDataField>> = {
            [params.primaryType]: params.types["x"].map(
              (value) =>
                ({
                  name: value.name,
                  type: value.type,
                } as TypedDataField)
            ),
          };

          return (await this.ethersWallet._signTypedData(
            params.domain ? params.domain : {},
            types,
            params.message
          )) as Address;
        },
      };

      this.simpleAccountOwner = owner;

      return owner;
    } catch (error) {
      return Promise.reject(
        `Get Simple Account Owner failed ${JSON.stringify(error)}`
      );
    }
  }

  async getAddress(): Promise<Address> {
    if (this.address) {
      return this.address;
    }

    try {
      const owner = this.simpleAccountOwner
        ? this.simpleAccountOwner
        : await this.getSimpleAccountOwner();
      this.address = await owner.getAddress();
      return this.address;
    } catch (error) {
      throw new Error(`Error getting address ${JSON.stringify(error)}`);
    }
  }

  async changeChain(): Promise<void> {
    if (this.smartWalletProvider === undefined) {
      this.smartWalletProvider = await this.initSmartWalletProvider();
    }

    try {
      this.simpleAccountOwner = await this.getSimpleAccountOwner();
      this.smartWalletProvider.changeChain(this.auth.chain);
    } catch (error) {
      return Promise.reject(`changeChain failed ${JSON.stringify(error)}`);
    }
  }

  async sendUserOperation(
    targetAddress: Address,
    data: Address,
    sponsorGas: Boolean
  ): Promise<{
    hash: string;
  }> {
    try {
      if (this.smartWalletProvider === undefined) {
        this.smartWalletProvider = await this.initSmartWalletProvider();
      }

      switch (this.smartWalletProviderInfo.name) {
        case SmartWalletProvider.alchemy:
          return await this.smartWalletProvider.sendUserOperation(
            targetAddress,
            data,
            sponsorGas
          );
        case SmartWalletProvider.fun:
        default:
          throw new Error("Auth Provider has not been impl yet");
      }
    } catch (error) {
      return Promise.reject(
        `sendUserOperation failed ${JSON.stringify(error)}`
      );
    }
  }

  async initSmartWalletProvider(): Promise<SnowballSmartWalletProvider> {
    try {
      if (this.simpleAccountOwner === undefined) {
        this.simpleAccountOwner = await this.getSimpleAccountOwner();
      }
      switch (this.smartWalletProviderInfo.name) {
        case SmartWalletProvider.alchemy:
          return new AlchemySmartWallet(
            this.simpleAccountOwner,
            this.smartWalletProviderInfo,
            this.auth.chain
          );
        case SmartWalletProvider.fun:
        default:
          throw new Error("Auth Provider has not been impl yet");
      }
    } catch (error) {
      return Promise.reject(
        `initSmartWalletProvider failed ${JSON.stringify(error)}`
      );
    }
  }

  async waitForUserOperationTransaction(
    hash: `0x${string}`
  ): Promise<`0x${string}`> {
    try {
      if (this.smartWalletProvider === undefined) {
        this.smartWalletProvider = await this.initSmartWalletProvider();
      }

      switch (this.smartWalletProviderInfo.name) {
        case SmartWalletProvider.alchemy:
          return await this.smartWalletProvider.waitForUserOperationTransaction(
            hash
          );
        case SmartWalletProvider.fun:
        default:
          throw new Error("Auth Provider has not been impl yet");
      }
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
      if (this.smartWalletProvider === undefined) {
        this.smartWalletProvider = await this.initSmartWalletProvider();
      }

      switch (this.smartWalletProviderInfo.name) {
        case SmartWalletProvider.alchemy:
          return await this.smartWalletProvider.getUserOperationByHash(hash);
        case SmartWalletProvider.fun:
        default:
          throw new Error("Auth Provider has not been impl yet");
      }
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
      if (this.smartWalletProvider === undefined) {
        this.smartWalletProvider = await this.initSmartWalletProvider();
      }

      switch (this.smartWalletProviderInfo.name) {
        case SmartWalletProvider.alchemy:
          return await this.smartWalletProvider.getUserOperationReceipt(hash);
        case SmartWalletProvider.fun:
        default:
          throw new Error("Auth Provider has not been impl yet");
      }
    } catch (error) {
      return Promise.reject(
        `getUserOperationByHash failed ${JSON.stringify(error)}`
      );
    }
  }
}
