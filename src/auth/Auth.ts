import type { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import type { Chain } from "../helpers/chains";
import { type SnowballAuth } from "../snowball";
import { AuthProvider, type AuthProviderInfo } from "../helpers";
import { SnowballPasskey } from "./Passkey";

export class Auth implements SnowballAuth {
  authProviderInfo: AuthProviderInfo;
  chain: Chain;
  authProvider: SnowballAuth;

  constructor(chain: Chain, authProviderInfo: AuthProviderInfo) {
    this.chain = chain;
    this.authProviderInfo = authProviderInfo;

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

  changeChain(chain: Chain) {
    this.chain = chain;
    this.authProvider.changeChain(chain);
  }
}
