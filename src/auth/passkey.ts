import { SimpleSmartAccountOwner } from "@alchemy/aa-core";
import { SnowballAuth } from "..";
import { Chain } from "../helpers/chains";
import { browserSupportsWebAuthn } from "@simplewebauthn/browser";

class Passkey implements SnowballAuth {
  public chain: Chain;

  constructor(chain: Chain) {
    this.chain = chain;
  }

  isWebAuthnSupported(): boolean {
    return (
      browserSupportsWebAuthn() && !navigator.userAgent.includes("Firefox")
    );
  }

  registerPasskey(username: string): Promise<void> {
    throw new Error("Method not implemented..");
  }
  authenticatePasskey(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getSimpleAccountOwner(chain: Chain): Promise<SimpleSmartAccountOwner> {
    throw new Error("Method not implemented.");
  }
}

export default Passkey;
