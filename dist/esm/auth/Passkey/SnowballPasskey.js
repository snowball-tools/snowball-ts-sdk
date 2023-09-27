import { browserSupportsWebAuthn } from "@simplewebauthn/browser";
import { AuthProvider } from "../../helpers";
import { LitPasskey } from "./providers";
export class SnowballPasskey {
    constructor(chain, authProviderInfo) {
        Object.defineProperty(this, "chain", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "authProviderInfo", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "passkeyProvider", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.chain = chain;
        this.authProviderInfo = authProviderInfo;
        this.passkeyProvider = this.initPasskeyProvider(authProviderInfo);
    }
    isWebAuthnSupported() {
        return browserSupportsWebAuthn();
    }
    async register(username) {
        try {
            switch (this.authProviderInfo.name) {
                case AuthProvider.lit:
                    return await this.passkeyProvider.registerPasskey(username);
                case AuthProvider.turnkey:
                default:
                    throw new Error("Method not implemented.");
            }
        }
        catch (e) {
            console.log("Error registering");
            console.log(e);
        }
    }
    async authenticate() {
        try {
            switch (this.authProviderInfo.name) {
                case AuthProvider.lit:
                    return await this.passkeyProvider.authenticatePasskey();
                case AuthProvider.turnkey:
                default:
                    throw new Error("Method not implemented.");
            }
        }
        catch (e) {
            console.log("Error authenticating");
            console.log(e);
        }
    }
    async getEthersWallet() {
        try {
            switch (this.authProviderInfo.name) {
                case AuthProvider.lit:
                    return await this.passkeyProvider.getEthersWallet();
                case AuthProvider.turnkey:
                default:
                    throw new Error("Method not implemented.");
            }
        }
        catch (e) {
            console.log("Error getting ethers wallet");
            console.log(e);
            throw Promise.reject(e);
        }
    }
    initPasskeyProvider(authProviderInfo) {
        switch (authProviderInfo.name) {
            case AuthProvider.lit:
                return new LitPasskey(this.chain, authProviderInfo);
            case AuthProvider.turnkey:
            default:
                throw new Error("Auth Provider has not been impl yet");
        }
    }
    async changeChain(chain) {
        try {
            this.chain = chain;
            return await this.passkeyProvider.changeChain(chain);
        }
        catch (e) {
            console.log(`Error changing chain to ${chain}. ${JSON.stringify(e)}}`);
            throw Promise.reject(e);
        }
    }
}
//# sourceMappingURL=SnowballPasskey.js.map