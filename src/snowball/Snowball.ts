import type { Address, Hex } from "@alchemy/aa-core";
import type { Chain } from "../helpers/chains";
import {
  type SmartWalletProviderInfo,
  type AuthProviderInfo,
} from "../helpers/constants";
import { SmartWallet } from "../wallet";
import type { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import { SnowballPasskey } from "../auth/Passkey";

export interface SnowballAuth {
  authProviderInfo: AuthProviderInfo;
  chain: Chain;
  isWebAuthnSupported(): boolean;
  register(username: string): Promise<void>;
  authenticate(): Promise<void>;
  getEthersWallet(): Promise<PKPEthersWallet>;
}

export interface SnowballSmartWallet {
  smartWalletProviderInfo: SmartWalletProviderInfo;
  auth: SnowballAuth;
  getAddress(): Promise<Address>;
  sendUserOperation(
    targetAddress: Address,
    data: Hex,
    sponsorGas: Boolean
  ): Promise<{
    hash: string;
  }>;
}

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
    this.getEthersWallet()
      .then((ethersWallet) => {
        this.smartWallet = new SmartWallet(
          ethersWallet,
          this.auth,
          this.smartWalletProviderInfo
        );
      })
      .catch((error) => {
        console.log(error);
      });
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
      this.chain = chain;
      this.auth.chain = chain;
    } catch (error) {
      return Promise.reject(`changeChain failed ${error}`);
    }
  }

  async getAddress(): Promise<Address> {
    try {
      if (this.smartWallet === undefined) {
        this.ethersWallet = await this.getEthersWallet();
        this.smartWallet = new SmartWallet(
          this.ethersWallet,
          this.auth,
          this.smartWalletProviderInfo
        );
      }
      return await this.smartWallet.getAddress();
    } catch (error) {
      return Promise.reject(`getAddress failed ${error}`);
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
        this.ethersWallet = await this.getEthersWallet();
        this.smartWallet = new SmartWallet(
          this.ethersWallet,
          this.auth,
          this.smartWalletProviderInfo
        );
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
