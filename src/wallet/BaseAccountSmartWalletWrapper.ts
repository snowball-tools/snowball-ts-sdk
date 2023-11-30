import {
  SignTypedDataParams,
  type Hex,
  ISmartContractAccount,
  BatchUserOperationCallData,
  BaseSmartContractAccount,
  SmartAccountSigner,
  WalletClientSigner,
  getDefaultEntryPointAddress,
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

import { viemChain } from "../helpers/chains";
import { LIT_RELAY_API_KEY } from "../helpers/env";
import { AlchemyProvider } from "@alchemy/aa-alchemy";

import { Auth } from "../auth/Auth";
import { SmartWalletProviderInfo } from "./types";
import { LitSigner } from "./LitSigner";
import { DeploymentState } from "@alchemy/aa-core/dist/types/account/base";

export abstract class BaseAccountSmartWalletWrapper {
  ethersWallet: PKPEthersWallet | undefined;
  auth: Auth;
  litSigner: LitSigner | undefined;
  private _baseAccount: ISmartContractAccount | undefined;
  private _lightAccount: LightSmartContractAccount | undefined;
  address: Address | undefined;
  smartWalletProviderInfo: SmartWalletProviderInfo;

  smartAccountSigner: SmartAccountSigner | undefined;

  constructor(auth: Auth, smartWalletProviderInfo: SmartWalletProviderInfo) {
    signer: this.litSigner?.getLitSigner();
    this.auth = auth;
    this.smartWalletProviderInfo = smartWalletProviderInfo;
  }

  async initAlchemyProvider(): Promise<AlchemyProvider> {
    const provider = new AlchemyProvider({
      apiKey: LIT_RELAY_API_KEY,
      chain: viemChain(this.chain),
    }).connect(
      (rpcClient) =>
        new LightSmartContractAccount({
          chain: viemChain(this.chain),
          owner: this.initLitSignerAccount(),
          factoryAddress: getDefaultLightAccountFactoryAddress(
            viemChain(this.chain)
          ),
          rpcClient: rpcClient,
        })
    );

    return provider;
  }

  private initLitSignerAccount(): SmartAccountSigner {
    const provider = new AlchemyProvider({
      apiKey: LIT_RELAY_API_KEY,
      chain: viemChain(this.chain),
    });

    return new WalletClientSigner(
      createWalletClient({
        transport: custom(provider),
      }),
      "lit"
    );
  }

  async getAccountOwner(): Promise<Address> {
    if (this.address) {
      return this.address;
    }

    try {
      const baseAccount = await this.getBaseAccount();
      this.address = await baseAccount.getAddress();
      return this.address;
    } catch (error) {
      throw new Error(`Error getting address ${JSON.stringify(error)}`);
    }
  }

  async getBaseAccount(): Promise<BaseSmartContractAccount> {
    try {
      if (this.ethersWallet === undefined) {
        this.ethersWallet = await this.auth.getEthersWallet();
      }

      const baseAccount: BaseSmartContractAccount = {
        _getAccountInitCode: undefined,
        create6492Signature: undefined,
        factoryAddress: getDefaultLightAccountFactoryAddress(
          viemChain(this.chain)
        ),
        deploymentState: DeploymentState.UNDEFINED,
        owner: await this.litSigner?.getLitSigner(),
        entryPoint: undefined,
        entryPointAddress: getDefaultEntryPointAddress(viemChain(this.chain)),
        rpcProvider: undefined,

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
          data: Hex
        ): Promise<Hex> => {
          const encodedExecute = await this._lightAccount!.encodeExecute(
            `0x${target}`,
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

        getAccountInitCode: function (): Promise<`0x${string}`> {
          throw new Error("Function not implemented.");
        },
        signUserOperationHash: function (
          uoHash: `0x${string}`
        ): Promise<`0x${string}`> {
          throw new Error("Function not implemented.");
        },
        getOwner: function (): SmartAccountSigner<any> | undefined {
          throw new Error("Function not implemented.");
        },
        getFactoryAddress: function (): `0x${string}` {
          throw new Error("Function not implemented.");
        },
        getEntryPointAddress: function (): `0x${string}` {
          throw new Error("Function not implemented.");
        },
        isAccountDeployed: function (): Promise<boolean> {
          throw new Error("Function not implemented.");
        },
        getDeploymentState: function (): Promise<DeploymentState> {
          throw new Error("Function not implemented.");
        },
        parseFactoryAddressFromAccountInitCode: function (): Promise<
          [`0x${string}`, `0x${string}`]
        > {
          throw new Error("Function not implemented.");
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
