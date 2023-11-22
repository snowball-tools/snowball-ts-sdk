import {
  SignTypedDataParams,
  type Hex,
  ISmartContractAccount,
  BatchUserOperationCallData,
} from "@alchemy/aa-core";
import { TypedDataField } from "ethers";
import { Chain } from "../helpers/chains";

import { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import { Address, Hash, SignTypedDataParameters } from "viem";
import { Auth } from "../auth/Auth";
import { SmartWalletProviderInfo } from "./types";
export abstract class BaseAccountSmartWallet {
  ethersWallet: PKPEthersWallet | undefined;
  auth: Auth;
  private _baseAccount: ISmartContractAccount | undefined;
  address: Address | undefined;
  smartWalletProviderInfo: SmartWalletProviderInfo;

  constructor(auth: Auth, smartWalletProviderInfo: SmartWalletProviderInfo) {
    this.auth = auth;
    this.smartWalletProviderInfo = smartWalletProviderInfo;
  }

  async getBaseAccount(): Promise<ISmartContractAccount> {
    if (this._baseAccount !== undefined) {
      return this._baseAccount;
    }

    try {
      if (this.ethersWallet === undefined) {
        this.ethersWallet = await this.auth.getEthersWallet();
      }

      const baseAccount: ISmartContractAccount = {
        getInitCode: async (): Promise<Hex> => {
          const initCode = await this._baseAccount!.getInitCode();
          return initCode;
        },

        getDummySignature: (): Hex => {
          const dummySignature = this._baseAccount!.getDummySignature();
          return dummySignature;
        },

        encodeExecute: async (
          target: string,
          value: bigint,
          data: string
        ): Promise<Hex> => {
          const encodedExecute = await this._baseAccount!.encodeExecute(
            target,
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
