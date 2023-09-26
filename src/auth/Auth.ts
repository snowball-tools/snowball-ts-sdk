import type { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import type { Chain } from "../helpers/chains";
import { type SnowballAuth } from "../snowball";
import { AuthProvider, type AuthProviderInfo } from "../helpers";
import { SnowballPasskey } from "./Passkey";

export class Auth implements SnowballAuth {
  authProviderInfo: AuthProviderInfo;
  chain: Chain;
  provider: SnowballAuth;

  constructor(chain: Chain, authProviderInfo: AuthProviderInfo) {
    this.chain = chain;
    this.authProviderInfo = authProviderInfo;

    this.provider = this.initAuthProvider();
  }

  isWebAuthnSupported(): boolean {
    throw new Error("Method not implemented.");
  }

  async register(username: string): Promise<void> {
    try {
      switch (this.authProviderInfo.name) {
        case AuthProvider.lit:
        case AuthProvider.turnkey:
          return await this.provider.register(username);
        default:
          throw new Error("Method not implemented.");
      }
    } catch (e) {
      console.log("Error registering");
      console.log(e);
    }
  }

  async authenticate(): Promise<void> {
    try {
      switch (this.authProviderInfo.name) {
        case AuthProvider.lit:
        case AuthProvider.turnkey:
          return await this.provider.authenticate();
        default:
          throw new Error("Method not implemented.");
      }
    } catch (e) {
      console.log("Error authenticating");
      console.log(e);
    }
  }

  async getEthersWallet(): Promise<PKPEthersWallet> {
    switch (this.authProviderInfo.name) {
      case AuthProvider.lit:
      case AuthProvider.turnkey:
        return await this.provider.getEthersWallet();
      default:
        throw new Error("Method not implemented.");
    }
  }

  initAuthProvider(): any {
    switch (this.authProviderInfo.name) {
      case AuthProvider.lit:
      case AuthProvider.turnkey:
        return new SnowballPasskey(this.chain, this.authProviderInfo);
      default:
        throw new Error("Method not implemented.");
    }
  }
}
