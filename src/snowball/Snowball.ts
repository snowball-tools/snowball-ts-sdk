import type {
  Address,
  Hex,
  UserOperationReceipt,
  UserOperationResponse,
} from "@alchemy/aa-core";
import type { Chain } from "../helpers/chains";
import {
  type SmartWalletProviderInfo,
  type AuthProviderInfo,
  AuthProvider,
} from "../helpers/constants";
import { SmartWallet } from "../wallet";
import type { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import { SnowballPasskey } from "../auth/Passkey";
import type { SnowballAuth, SnowballSmartWallet } from "./types";
import { LIT_RELAY_API_KEY } from "../helpers/env";
import { Hash } from "viem";

export class Snowball {
  private apiKey: string;
  private chain: Chain;
  private authProviderInfo: AuthProviderInfo;
  private smartWalletProviderInfo: SmartWalletProviderInfo;

  public auth: SnowballAuth;
  public smartWallet: SnowballSmartWallet | undefined;
  public ethersWallet: PKPEthersWallet | undefined;

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

    this.auth = new SnowballPasskey(this.chain, this.authProviderInfo);
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

  async changeChain(chain: Chain) {
    try {
      if (this.smartWallet === undefined) {
        this.smartWallet = await this.initSmartWallet();
      }
      this.chain = chain;
      this.smartWallet.changeChain();
    } catch (error) {
      return Promise.reject(`changeChain failed ${error}`);
    }
  }

  async getAddress(): Promise<Address> {
    try {
      if (this.smartWallet === undefined) {
        this.smartWallet = await this.initSmartWallet();
      }
      return await this.smartWallet.getAddress();
    } catch (error) {
      return Promise.reject(`getAddress failed ${error}`);
    }
  }

  private async initSmartWallet(): Promise<SnowballSmartWallet> {
    try {
      if (this.ethersWallet === undefined) {
        this.ethersWallet = await this.getEthersWallet();
      }
      this.smartWallet = new SmartWallet(
        this.ethersWallet,
        this.auth,
        this.smartWalletProviderInfo
      );
      return this.smartWallet;
    } catch (error) {
      return Promise.reject(`initSmartWallet failed ${error}`);
    }
  }

  async sendUserOperation(
    targetAddress: Address,
    data: Hex,
    sponsorGas: Boolean
  ): Promise<{
    hash: string;
  }> {
    try {
      if (this.smartWallet === undefined) {
        this.smartWallet = await this.initSmartWallet();
      }
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
      if (this.smartWallet === undefined) {
        this.smartWallet = await this.initSmartWallet();
      }
      return await this.smartWallet.waitForUserOperationTransaction(hash);
    } catch (error) {
      return Promise.reject(`waitForUserOperationTransaction failed ${error}`);
    }
  }

  async getUserOperationByHash(hash: Hash): Promise<UserOperationResponse> {
    try {
      if (this.smartWallet === undefined) {
        this.smartWallet = await this.initSmartWallet();
      }
      return await this.smartWallet.getUserOperationByHash(hash);
    } catch (error) {
      return Promise.reject(`getUserOperationByHash failed ${error}`);
    }
  }

  async getUserOperationReceipt(hash: Hash): Promise<UserOperationReceipt> {
    try {
      if (this.smartWallet === undefined) {
        this.smartWallet = await this.initSmartWallet();
      }
      return await this.smartWallet.getUserOperationReceipt(hash);
    } catch (error) {
      return Promise.reject(`getUserOperationReceipt failed ${error}`);
    }
  }
}
