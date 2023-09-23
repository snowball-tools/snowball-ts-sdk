import { browserSupportsWebAuthn } from "@simplewebauthn/browser";
export class Passkey {
    chain;
    authProvider;
    constructor(chain, authProvider) {
        this.chain = chain;
        this.authProvider = authProvider;
    }
    // isWebAuthnSupported(): boolean {
    //   return (
    //     browserSupportsWebAuthn() && !navigator.userAgent.includes("Firefox")
    //   );
    // }
    registerPasskey(_username) {
        throw new Error("Method not implemented..");
    }
    authenticatePasskey() {
        throw new Error("Method not implemented.");
    }
    getSimpleAccountOwner() {
        throw new Error("Method not implemented.");
    }
}
//# sourceMappingURL=Passkey.js.map