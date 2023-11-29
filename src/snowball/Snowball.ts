import {
  type Address,
  type Hex,
  type UserOperationReceipt,
  type UserOperationResponse,
  type SmartAccountSigner,
  WalletClientSigner,
} from "@alchemy/aa-core";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import {
  LightSmartContractAccount,
  getDefaultLightAccountFactoryAddress,
} from "@alchemy/aa-accounts";

import { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import { Hash, createWalletClient, custom } from "viem";

import { viemChain, type Chain } from "../helpers/chains";
import { LIT_RELAY_API_KEY } from "../helpers/env";
import { AlchemySmartWallet } from "../wallet/AlchemySmartWallet";
import { FunSmartWallet } from "../wallet/FunSmartWallet";
import { SmartWallet } from "../wallet/SmartWallet";
import type { SmartWalletProviderInfo } from "../wallet/types";
import { SmartWalletProvider } from "../wallet/base";
import { LitPasskey } from "../auth/passkey/LitPasskey";
import { TurkeyPasskey } from "../auth/passkey/TurkeyPasskey";
import type { AuthProviderInfo } from "../auth/types";
import { Auth } from "../auth/Auth";
import { AuthProvider } from "../auth/base";

export class Snowball {
  private apiKey: string;
  private chain: Chain;
  private authProviderInfo: AuthProviderInfo;
  private smartWalletProviderInfo: SmartWalletProviderInfo;

  private auth: Auth;
  private smartWallet: SmartWallet;

  constructor(
    apiKey: string,
    chain: Chain,
    authProviderInfo: AuthProviderInfo,
    smartWalletProviderInfo: SmartWalletProviderInfo
  ) {
    this.apiKey = apiKey;
    this.chain = chain;
    this.authProviderInfo =
      authProviderInfo.name == AuthProvider.lit
        ? {
            name: authProviderInfo.name,
            apiKeys: {
              relayKey: LIT_RELAY_API_KEY + "_" + this.apiKey,
            },
          }
        : authProviderInfo;
    this.smartWalletProviderInfo = smartWalletProviderInfo;

    this.auth = this.initAuth();
    this.smartWallet = this.initSmartWallet();
  }

  private initAuth(): Auth {
    switch (this.authProviderInfo.name) {
      case AuthProvider.turnkey:
        return new TurkeyPasskey(this.chain, this.authProviderInfo);
      default:
      case AuthProvider.lit:
        return new LitPasskey(this.chain, this.authProviderInfo);
    }
  }

  private initSmartWallet(): SmartWallet {
    switch (this.smartWalletProviderInfo.name) {
      case SmartWalletProvider.fun:
        return new FunSmartWallet(this.auth, this.smartWalletProviderInfo);
      default:
      case SmartWalletProvider.alchemy:
        return new AlchemySmartWallet(this.auth, this.smartWalletProviderInfo);
    }
  }

  private initLitSignerAccount(): SmartAccountSigner {
    const provider = new AlchemyProvider({
      apiKey: this.apiKey,
      chain: viemChain(this.chain),
    });

    return new WalletClientSigner(
      createWalletClient({
        transport: custom(provider),
      }),
      "lit"
    );
  }

  async initAlchemyLightAccount(): Promise<Address> {
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

    const lightAccountAddress = await provider.getAddress();
    return lightAccountAddress;
  }

  async register(username: string): Promise<void> {
    try {
      return await this.auth.register(username);
    } catch (error) {
      return Promise.reject(`register failed ${error}`);
    }
  }

  async authenticate(): Promise<void> {
    try {
      return await this.auth.authenticate();
    } catch (error) {
      return Promise.reject(`authenticate failed ${error}`);
    }
  }

  async getEthersWallet(): Promise<PKPEthersWallet> {
    try {
      return await this.auth.getEthersWallet();
    } catch (error) {
      return Promise.reject(`getEthersWallet failed ${error}`);
    }
  }

  async switchChain(chain: Chain) {
    try {
      this.chain = chain;
      this.smartWallet.switchChain();
    } catch (error) {
      return Promise.reject(`changeChain failed ${error}`);
    }
  }

  async getAddress(): Promise<Address> {
    try {
      return await this.smartWallet.getAddress();
    } catch (error) {
      return Promise.reject(`getAddress failed ${error}`);
    }
  }

  async sendUserOperation(
    targetAddress: Address,
    data: Hex,
    sponsorGas: boolean
  ): Promise<{
    hash: string;
  }> {
    try {
      return await this.smartWallet.sendUserOperation(
        targetAddress,
        data,
        sponsorGas
      );
    } catch (error) {
      return Promise.reject(`sendUserOperation failed ${error}`);
    }
  }

  async waitForUserOperationTransaction(hash: Hash): Promise<Hash> {
    try {
      return await this.smartWallet.waitForUserOperationTransaction(hash);
    } catch (error) {
      return Promise.reject(`waitForUserOperationTransaction failed ${error}`);
    }
  }

  async getUserOperationByHash(hash: Hash): Promise<UserOperationResponse> {
    try {
      return await this.smartWallet.getUserOperationByHash(hash);
    } catch (error) {
      return Promise.reject(`getUserOperationByHash failed ${error}`);
    }
  }

  async getUserOperationReceipt(hash: Hash): Promise<UserOperationReceipt> {
    try {
      return await this.smartWallet.getUserOperationReceipt(hash);
    } catch (error) {
      return Promise.reject(`getUserOperationReceipt failed ${error}`);
    }
  }
}
