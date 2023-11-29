import {
  SignTypedDataParams,
  type Hex,
  ISmartContractAccount,
  BatchUserOperationCallData,
  BaseSmartContractAccount,
  SmartAccountSigner,
  LocalAccountSigner,
  WalletClientSigner,
} from "@alchemy/aa-core";
import {
  LightSmartContractAccount,
  getDefaultLightAccountFactoryAddress,
} from "@alchemy/aa-accounts";
import { TypedDataField } from "ethers";
import { Chain } from "../helpers/chains";

import { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import {
  Address,
  Hash,
  SignTypedDataParameters,
  createWalletClient,
  custom,
} from "viem";

import { Auth } from "../auth/Auth";
import { SmartWalletProviderInfo } from "./types";
export abstract class BaseAccountSmartWallet {
  ethersWallet: PKPEthersWallet | undefined;
  auth: Auth;
  private _baseAccount: ISmartContractAccount | undefined;
  private _lightAccount: LightSmartContractAccount | undefined;
  address: Address | undefined;
  smartWalletProviderInfo: SmartWalletProviderInfo;

  smartAccountSigner: SmartAccountSigner | undefined;

  constructor(auth: Auth, smartWalletProviderInfo: SmartWalletProviderInfo) {
    this.auth = auth;
    this.smartWalletProviderInfo = smartWalletProviderInfo;
  }

  // return the owner of the smart wallet
  // async getAccountSigner(): Promise<SmartAccountSigner> {
  //   this.smartAccountSigner = new WalletClientSigner(
  //     createWalletClient({ transport: custom(this.ethersWallet?.rpcProvider) }),
  //     "lit"
  //   );
  // }

  async getBaseAccount(): Promise<BaseSmartContractAccount> {
    if (this._lightAccount !== undefined) {
      return this._lightAccount;
    }

    try {
      if (this.ethersWallet === undefined) {
        this.ethersWallet = await this.auth.getEthersWallet();
      }

      const baseAccount: BaseSmartContractAccount = {
        //spread from lightsmartcontractaccount

        // getOwnerAddress: async (): Promise<Address> => {
        //   const ownerAddress = await this._lightAccount!.getOwnerAddress();
        //   return ownerAddress;
        // },

        getInitCode: async (): Promise<Hex> => {
          const initCode = await this._lightAccount!.getInitCode();
          return initCode;
        },

        getDummySignature: (): Hex => {
          const dummySignature = this._lightAccount!.getDummySignature();
          return dummySignature;
        },

        encodeExecute: async (
          target: string,
          value: bigint,
          data: string
        ): Promise<Hex> => {
          const encodedExecute = await this._lightAccount!.encodeExecute(
            `0x${target}`, // Add '0x' prefix to the target
            value,
            data
          );
          return encodedExecute;
        },

        encodeBatchExecute: async (
          txs: BatchUserOperationCallData
        ): Promise<Hex> => {
          const encodedBatchExecute =
            await this._baseAccount!.encodeBatchExecute(txs);
          return encodedBatchExecute;
        },

        getNonce: async (): Promise<bigint> => {
          const nonce = await this._baseAccount!.getNonce();
          return nonce;
        },

        signMessage: async (msg: Uint8Array): Promise<Hex> => {
          return await this._baseAccount!.signMessage(msg);
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

        signMessageWith6492: async (msg: string | Uint8Array): Promise<Hex> => {
          const signedMessageWith6492 =
            await this._baseAccount!.signMessageWith6492(msg);
          return signedMessageWith6492;
        },

        signTypedDataWith6492: async (
          params: SignTypedDataParameters
        ): Promise<Hash> => {
          const signedTypedDataWith6492 =
            await this._baseAccount!.signTypedDataWith6492(params);
          return signedTypedDataWith6492;
        },

        getAddress: async () => {
          return (await this._baseAccount!.getAddress()) as Address;
        },
      };

      this._baseAccount = baseAccount;
      return baseAccount;
    } catch (error) {
      return Promise.reject(`Get Base Account failed ${JSON.stringify(error)}`);
    }
  }
  public get chain(): Chain {
    return this.auth.chain;
  }
}
