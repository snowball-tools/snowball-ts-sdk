import { browserSupportsWebAuthn } from "@simplewebauthn/browser";
export class Passkey {
    constructor(chain) {
        Object.defineProperty(this, "chain", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.chain = chain;
    }
    isWebAuthnSupported() {
        return browserSupportsWebAuthn();
        //&& !navigator.userAgent.includes("Firefox")
    }
    registerPasskey(_username) {
        throw new Error("Method not implemented..");
    }
    authenticatePasskey() {
        throw new Error("Method not implemented.");
    }
    getSimpleAccountOwner(_chain) {
        throw new Error("Method not implemented.");
    }
}
//# sourceMappingURL=passkey.js.map