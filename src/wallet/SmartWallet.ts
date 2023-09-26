import {
  type Address,
  type SignTypedDataParams,
  type SimpleSmartAccountOwner,
} from "@alchemy/aa-core";
import type { TypedDataField } from "ethers";
import { AlchemySmartWallet } from "./providers/AlchemySmartWallet";
import type { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import type { SnowballAuth, SnowballSmartWallet } from "../snowball";
import { SmartWalletProvider, type SmartWalletProviderInfo } from "../helpers";
import type { SnowballSmartWalletProvider } from "./providers";

export class SmartWallet implements SnowballSmartWallet {
  smartWalletProvider: SnowballSmartWalletProvider | undefined;
  ethersWallet: PKPEthersWallet | undefined;
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

    this.getSimpleAccountOwner()
      .then((owner) => {
        this.simpleAccountOwner = owner;

        owner
          .getAddress()
          .catch((error) => {
            console.log(error);
          })
          .then(() => {
            this.smartWalletProvider = this.initSmartWalletProvider(owner);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async getSimpleAccountOwner(): Promise<SimpleSmartAccountOwner> {
    if (this.simpleAccountOwner) {
      return this.simpleAccountOwner;
    }

    try {
      const owner: SimpleSmartAccountOwner = {
        signMessage: async (msg: Uint8Array) => {
          return (await this.ethersWallet!.signMessage(msg)) as Address;
        },
        getAddress: async () => {
          return (await this.ethersWallet!.getAddress()) as Address;
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

          return (await this.ethersWallet!._signTypedData(
            params.domain ? params.domain : {},
            types,
            params.message
          )) as Address;
        },
      };

      this.simpleAccountOwner = owner;

      return owner;
    } catch (error) {
      return Promise.reject(`Get Simple Account Owner failed ${error}`);
    }
  }

  async getAddress(): Promise<Address> {
    if (this.address) {
      return this.address;
    }

    try {
      const owner = await this.getSimpleAccountOwner();
      this.address = await owner.getAddress();
      return this.address;
    } catch (e) {
      throw new Error("Error getting address");
    }
  }

  async sendUserOperation(
    targetAddress: Address,
    data: Address,
    sponsorGas: Boolean
  ): Promise<{
    hash: string;
  }> {
    switch (this.smartWalletProviderInfo.name) {
      case SmartWalletProvider.alchemy:
        return this.sendUserOperation(targetAddress, data, sponsorGas);
      case SmartWalletProvider.fun:
      default:
        throw new Error("Auth Provider has not been impl yet");
    }
  }

  initSmartWalletProvider(
    simpleAccountOwner: SimpleSmartAccountOwner
  ): SnowballSmartWalletProvider {
    switch (this.smartWalletProviderInfo.name) {
      case SmartWalletProvider.alchemy:
        return new AlchemySmartWallet(
          simpleAccountOwner,
          this.smartWalletProviderInfo,
          this.auth.chain
        );
      case SmartWalletProvider.fun:
      default:
        throw new Error("Auth Provider has not been impl yet");
    }
  }
}
