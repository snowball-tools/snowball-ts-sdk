import {
  UserOperationReceipt,
  UserOperationResponse,
  type Address,
  type SignTypedDataParams,
  type SimpleSmartAccountOwner,
} from "@alchemy/aa-core";
import type { TypedDataField } from "ethers";
import type { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import { Chain } from "../helpers";
import { Hash, Hex } from "viem";
import { Auth } from "../auth";
import { SmartWalletProviderInfo } from "./types";

export abstract class SmartWallet {
  ethersWallet: PKPEthersWallet | undefined;
  auth: Auth;
  private _simpleAccountOwner: SimpleSmartAccountOwner | undefined;
  address: Address | undefined;
  smartWalletProviderInfo: SmartWalletProviderInfo;

  constructor(auth: Auth, smartWalletProviderInfo: SmartWalletProviderInfo) {
    this.auth = auth;
    this.smartWalletProviderInfo = smartWalletProviderInfo;
  }

  async getSimpleAccountOwner(): Promise<SimpleSmartAccountOwner> {
    if (this._simpleAccountOwner !== undefined) {
      return this._simpleAccountOwner;
    }

    try {
      if (this.ethersWallet === undefined) {
        this.ethersWallet = await this.auth.getEthersWallet();
      }

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

      this._simpleAccountOwner = owner;

      return owner;
    } catch (error) {
      return Promise.reject(
        `Get Simple Account Owner failed ${JSON.stringify(error)}`
      );
    }
  }

  public get chain(): Chain {
    return this.auth.chain;
  }

  abstract getAddress(): Promise<Address>;
  abstract switchChain(): Promise<void>;
  abstract sendUserOperation(
    targetAddress: Address,
    data: Hex,
    sponsorGas: boolean
  ): Promise<{
    hash: string;
  }>;
  abstract waitForUserOperationTransaction(hash: Hash): Promise<Hash>;
  abstract getUserOperationByHash(hash: Hash): Promise<UserOperationResponse>;
  abstract getUserOperationReceipt(hash: Hash): Promise<UserOperationReceipt>;
}
