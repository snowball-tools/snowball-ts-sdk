import type { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import type { Chain } from "../helpers/chains";
import { type SnowballAuth } from "../snowball";
import { AuthProvider, type AuthProviderInfo } from "../helpers";
import { SnowballPasskey } from "./Passkey";
import { LIT_RELAY_API_KEY } from "../helpers/env";

export class Auth implements SnowballAuth {
  authProviderInfo: AuthProviderInfo;
  chain: Chain;
  authProvider: SnowballAuth;

  constructor(
    chain: Chain,
    authProviderInfo: AuthProviderInfo,
    snowballAPIKey: string
  ) {
    this.chain = chain;
    this.authProviderInfo = {
      name: authProviderInfo.name,
      apiKeys: {
        relayKey: LIT_RELAY_API_KEY + "_" + snowballAPIKey,
      },
    };

    this.authProvider = this.initAuthProvider();
  }

  async register(username: string): Promise<void> {
    try {
      switch (this.authProviderInfo.name) {
        case AuthProvider.lit:
          return await this.authProvider.register(username);
        case AuthProvider.turnkey:
        default:
          return Promise.reject("Method not implemented.");
      }
    } catch (e) {
      Promise.reject(`registering failed ${JSON.stringify(e)}`);
    }
  }

  async authenticate(): Promise<void> {
    try {
      switch (this.authProviderInfo.name) {
        case AuthProvider.lit:
          return await this.authProvider.authenticate();
        case AuthProvider.turnkey:
        default:
          return Promise.reject("Method not implemented.");
      }
    } catch (e) {
      return Promise.reject(`authenticating failed ${JSON.stringify(e)}`);
    }
  }

  async getEthersWallet(): Promise<PKPEthersWallet> {
    try {
      switch (this.authProviderInfo.name) {
        case AuthProvider.lit:
          return await this.authProvider.getEthersWallet();
        case AuthProvider.turnkey:
        default:
          return Promise.reject("Method not implemented.");
      }
    } catch (e) {
      return Promise.reject(`getEthersWallet failed ${JSON.stringify(e)}`);
    }
  }

  initAuthProvider(): SnowballAuth {
    switch (this.authProviderInfo.name) {
      case AuthProvider.lit:
      case AuthProvider.turnkey:
      default:
        return new SnowballPasskey(this.chain, this.authProviderInfo);
    }
  }

  async changeChain(chain: Chain): Promise<PKPEthersWallet> {
    try {
      this.chain = chain;
      return await this.authProvider.changeChain(chain);
    } catch (error) {
      return Promise.reject(`changeChain failed ${JSON.stringify(error)}`);
    }
  }
}
