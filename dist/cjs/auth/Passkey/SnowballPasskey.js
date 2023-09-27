"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnowballPasskey = void 0;
const browser_1 = require("@simplewebauthn/browser");
const helpers_1 = require("../../helpers");
const providers_1 = require("./providers");
class SnowballPasskey {
  constructor(chain, authProviderInfo) {
    Object.defineProperty(this, "chain", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0,
    });
    Object.defineProperty(this, "authProviderInfo", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0,
    });
    Object.defineProperty(this, "passkeyProvider", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0,
    });
    this.chain = chain;
    this.authProviderInfo = authProviderInfo;
    this.passkeyProvider = this.initPasskeyProvider(authProviderInfo);
  }
  isWebAuthnSupported() {
    return (0, browser_1.browserSupportsWebAuthn)();
  }
  async register(username) {
    try {
      switch (this.authProviderInfo.name) {
        case helpers_1.AuthProvider.lit:
          return await this.passkeyProvider.registerPasskey(username);
        case helpers_1.AuthProvider.turnkey:
        default:
          throw new Error("Method not implemented.");
      }
    } catch (e) {
      console.log("Error registering");
      console.log(e);
    }
  }
  async authenticate() {
    try {
      switch (this.authProviderInfo.name) {
        case helpers_1.AuthProvider.lit:
          return await this.passkeyProvider.authenticatePasskey();
        case helpers_1.AuthProvider.turnkey:
        default:
          throw new Error("Method not implemented.");
      }
    } catch (e) {
      console.log("Error authenticating");
      console.log(e);
    }
  }
  async getEthersWallet() {
    try {
      switch (this.authProviderInfo.name) {
        case helpers_1.AuthProvider.lit:
          return await this.passkeyProvider.getEthersWallet();
        case helpers_1.AuthProvider.turnkey:
        default:
          throw new Error("Method not implemented.");
      }
    } catch (e) {
      console.log("Error getting ethers wallet");
      console.log(e);
      throw Promise.reject(e);
    }
  }
  initPasskeyProvider(authProviderInfo) {
    switch (authProviderInfo.name) {
      case helpers_1.AuthProvider.lit:
        return new providers_1.LitPasskey(this.chain, authProviderInfo);
      case helpers_1.AuthProvider.turnkey:
      default:
        throw new Error("Auth Provider has not been impl yet");
    }
  }
  async changeChain(chain) {
    try {
      this.chain = chain;
      return await this.passkeyProvider.changeChain(chain);
    } catch (e) {
      console.log(`Error changing chain to ${chain}. ${JSON.stringify(e)}}`);
      throw Promise.reject(e);
    }
  }
}
exports.SnowballPasskey = SnowballPasskey;
//# sourceMappingURL=SnowballPasskey.js.map
