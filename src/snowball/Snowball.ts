import type {
  Address,
  Hex,
  UserOperationReceipt,
  UserOperationResponse,
} from "@alchemy/aa-core";
import type { Chain } from "../helpers/chains";
import type { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import { LIT_RELAY_API_KEY } from "../helpers/env";
import { Hash } from "viem";
import { Auth } from "../auth";
import { AlchemySmartWallet, FunSmartWallet, SmartWallet } from "../wallet";
import { LitPasskey, TurkeyPasskey } from "../auth";
import { SmartWalletProvider, SmartWalletProviderInfo } from "../wallet/types";
import { AuthProvider, AuthProviderInfo } from "../auth";
import { validateSnowballAPIKey } from "../helpers/keys";

export class Snowball {
  apiKey: string;
  isApiKeyValid: boolean = false;
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

  @CheckApiKey
  private initAuth(): Auth {
    switch (this.authProviderInfo.name) {
      case AuthProvider.lit:
        return new LitPasskey(this.chain, this.authProviderInfo);
      case AuthProvider.turnkey:
        return new TurkeyPasskey(this.chain, this.authProviderInfo);
    }
  }

  @CheckApiKey
  private initSmartWallet(): SmartWallet {
    switch (this.smartWalletProviderInfo.name) {
      case SmartWalletProvider.alchemy:
        return new AlchemySmartWallet(this.auth, this.smartWalletProviderInfo);
      case SmartWalletProvider.fun:
        return new FunSmartWallet(this.auth, this.smartWalletProviderInfo);
    }
  }

  @CheckApiKey
  async register(username: string): Promise<void> {
    try {
      return await this.auth.register(username);
    } catch (error) {
      return Promise.reject(`register failed ${error}`);
    }
  }

  @CheckApiKey
  async authenticate(): Promise<void> {
    try {
      return await this.auth.authenticate();
    } catch (error) {
      return Promise.reject(`authenticate failed ${error}`);
    }
  }

  @CheckApiKey
  async getEthersWallet(): Promise<PKPEthersWallet> {
    try {
      return await this.auth.getEthersWallet();
    } catch (error) {
      return Promise.reject(`getEthersWallet failed ${error}`);
    }
  }

  @CheckApiKey
  async switchChain(chain: Chain) {
    try {
      this.chain = chain;
      this.smartWallet.switchChain();
    } catch (error) {
      return Promise.reject(`changeChain failed ${error}`);
    }
  }

  @CheckApiKey
  async getAddress(): Promise<Address> {
    try {
      return await this.smartWallet.getAddress();
    } catch (error) {
      return Promise.reject(`getAddress failed ${error}`);
    }
  }

  @CheckApiKey
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

  @CheckApiKey
  async waitForUserOperationTransaction(hash: Hash): Promise<Hash> {
    try {
      return await this.smartWallet.waitForUserOperationTransaction(hash);
    } catch (error) {
      return Promise.reject(`waitForUserOperationTransaction failed ${error}`);
    }
  }

  @CheckApiKey
  async getUserOperationByHash(hash: Hash): Promise<UserOperationResponse> {
    try {
      return await this.smartWallet.getUserOperationByHash(hash);
    } catch (error) {
      return Promise.reject(`getUserOperationByHash failed ${error}`);
    }
  }

  @CheckApiKey
  async getUserOperationReceipt(hash: Hash): Promise<UserOperationReceipt> {
    try {
      return await this.smartWallet.getUserOperationReceipt(hash);
    } catch (error) {
      return Promise.reject(`getUserOperationReceipt failed ${error}`);
    }
  }
}

function CheckApiKey(
  target: Object,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<any>
) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    const instance = this as Snowball;
    instance.isApiKeyValid = await validateSnowballAPIKey(instance.apiKey);
    if (!instance.isApiKeyValid) {
      throw new Error("Invalid API Key");
    }
    return originalMethod.apply(this, args);
  };

  return descriptor;
}
