import type { Chain } from "../../helpers/chains";
import type { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import { AuthProvider, type AuthProviderInfo } from "../../helpers";
import type { SnowballAuth } from "../../snowball";
import { LitPasskey, type SnowballPasskeyProvider } from "./providers";

export class SnowballPasskey implements SnowballAuth {
  chain: Chain;
  public authProviderInfo: AuthProviderInfo;
  public passkeyProvider: SnowballPasskeyProvider;

  constructor(chain: Chain, authProviderInfo: AuthProviderInfo) {
    this.chain = chain;
    this.authProviderInfo = authProviderInfo;
    this.passkeyProvider = this.initPasskeyProvider(authProviderInfo);
  }

  async register(username: string): Promise<void> {
    try {
      switch (this.authProviderInfo.name) {
        case AuthProvider.lit:
          return await this.passkeyProvider.registerPasskey(username);
        case AuthProvider.turnkey:
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
          return await this.passkeyProvider.authenticatePasskey();
        case AuthProvider.turnkey:
        default:
          throw new Error("Method not implemented.");
      }
    } catch (e) {
      console.log("Error authenticating");
      console.log(e);
    }
  }

  async getEthersWallet(): Promise<PKPEthersWallet> {
    try {
      switch (this.authProviderInfo.name) {
        case AuthProvider.lit:
          return await this.passkeyProvider.getEthersWallet();
        case AuthProvider.turnkey:
        default:
          throw new Error("Method not implemented.");
      }
    } catch (e) {
      console.log("Error getting ethers wallet");
      console.log(e);
      throw Promise.reject(e);
    }
  }

  initPasskeyProvider(authProviderInfo: AuthProviderInfo) {
    switch (authProviderInfo.name) {
      case AuthProvider.lit:
        return new LitPasskey(this.chain, authProviderInfo);
      case AuthProvider.turnkey:
      default:
        throw new Error("Auth Provider has not been impl yet");
    }
  }

  changeChain(chain: Chain) {
    this.chain = chain;
    this.passkeyProvider.chain = chain;
  }
}