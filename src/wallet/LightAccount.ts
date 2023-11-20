import {
  LightSmartContractAccount,
  getDefaultLightAccountFactoryAddress,
} from "@alchemy/aa-accounts";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import {
  LocalAccountSigner,
  SignTypedDataParams,
  type Hex,
} from "@alchemy/aa-core";
import { TypedDataField } from "ethers";
import { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import { Address, Hash, RpcTransactionRequest } from "viem";
import { Auth } from "../auth/Auth";
import { SmartWalletProviderInfo } from "../../lib/wallet/types";

export abstract class LightAccount {
  ethersWallet: PKPEthersWallet | undefined;
  auth: Auth;
  private _lightAccount: LightSmartContractAccount | undefined;
  address: Address | undefined;
  SmartWalletProviderInfo: SmartWalletProviderInfo;
  constructor(auth: Auth, SmartWalletProviderInfo: SmartWalletProviderInfo) {
    this.auth = auth;
    this.SmartWalletProviderInfo = SmartWalletProviderInfo;
  }

  async getLightAccount(): Promise<LightSmartContractAccount> {
    if (this._lightAccount !== undefined) {
      return this._lightAccount;
    }

    try {
      if (this.ethersWallet === undefined) {
        this.ethersWallet = await this.auth.getEthersWallet();
      }

      const owner: LightSmartContractAccount = {
        signMessage: async (msg: Uint8Array) => {
          return (await this._lightAccount!.signMessage(msg)) as Address;
        },
        getAddress: async () => {
          return (await this._lightAccount!.getAddress()) as Address;
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

      this._lightAccount = owner;

      return owner;
    } catch (e) {
      throw new Error(`Failed to get light account owner: ${e}`);
    }
  }
}
