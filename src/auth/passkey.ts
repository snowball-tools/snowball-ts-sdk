import type { SimpleSmartAccountOwner } from "@alchemy/aa-core";
import type { AuthProvider, SnowballAuth } from "..";
import type { Chain } from "../helpers/chains";
import { browserSupportsWebAuthn } from "@simplewebauthn/browser";
import type { AuthMethod } from "@lit-protocol/types";

export class Passkey implements SnowballAuth {
  public chain: Chain;
  public authProvider: AuthProvider;

  constructor(chain: Chain, authProvider: AuthProvider) {
    this.chain = chain;
    this.authProvider = authProvider;
  }

  isWebAuthnSupported(): boolean {
    return (
      browserSupportsWebAuthn() && !navigator.userAgent.includes("Firefox")
    );
  }

  registerPasskey(_username: string): Promise<void> {
    throw new Error("Method not implemented..");
  }
  authenticatePasskey(): Promise<AuthMethod> {
    throw new Error("Method not implemented.");
  }
  getSimpleAccountOwner(): Promise<SimpleSmartAccountOwner> {
    throw new Error("Method not implemented.");
  }
}
