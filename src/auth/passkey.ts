import type { SimpleSmartAccountOwner } from "@alchemy/aa-core";
import type { SnowballAuth } from "..";
import type { Chain } from "../helpers/chains";
import { browserSupportsWebAuthn } from "@simplewebauthn/browser";

export class Passkey implements SnowballAuth {
  public chain: Chain;

  constructor(chain: Chain) {
    this.chain = chain;
  }

  isWebAuthnSupported(): boolean {
    return browserSupportsWebAuthn();
    //&& !navigator.userAgent.includes("Firefox")
  }

  registerPasskey(_username: string): Promise<void> {
    throw new Error("Method not implemented..");
  }
  authenticatePasskey(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getSimpleAccountOwner(_chain: Chain): Promise<SimpleSmartAccountOwner> {
    throw new Error("Method not implemented.");
  }
}
