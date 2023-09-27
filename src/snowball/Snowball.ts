import type { Address, Hex } from "@alchemy/aa-core";
import type { Chain } from "../helpers/chains";
import {
  type SmartWalletProviderInfo,
  type AuthProviderInfo,
} from "../helpers/constants";
import { SmartWallet } from "../wallet";
import type { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import { SnowballPasskey } from "../auth/Passkey";
import type { SnowballAuth, SnowballSmartWallet } from "./types";

export class Snowball {
  private chain: Chain;
  private authProviderInfo: AuthProviderInfo;
  private smartWalletProviderInfo: SmartWalletProviderInfo;

  public auth: SnowballAuth;
  public smartWallet: SnowballSmartWallet | undefined;
  public ethersWallet: PKPEthersWallet | undefined;

  constructor(
    _apiKey: string,
    chain: Chain,
    authProviderInfo: AuthProviderInfo,
    smartWalletProviderInfo: SmartWalletProviderInfo
  ) {
    this.chain = chain;
    this.authProviderInfo = authProviderInfo;
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

  async changeChain(chain: Chain): Promise<void> {
    try {
      if (this.smartWallet === undefined) {
        this.smartWallet = await this.initSmartWallet();
      }
      this.chain = chain;
      const ethersWallet = await this.auth.changeChain(chain);
      await this.smartWallet.changeChain(ethersWallet);
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
}
