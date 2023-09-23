import type {
  SimpleSmartAccountOwner,
  Address,
  Hex,
  ISmartAccountProvider,
  SendUserOperationResult,
} from "@alchemy/aa-core";
import type { Chain } from "../helpers/chains";
import type { FallbackTransport, Transport } from "viem";
import type { AuthMethod } from "@lit-protocol/types";
import {
  type AuthProvider,
  type AAProvider,
  Auth,
  AA,
} from "../helpers/constants";
import { AlchemyAA } from "../SmartContractWallet/AlchemyAA";
import { LitPasskey } from "../Auth/LitPasskey";

export interface SnowballAuth {
  authProvider: AuthProvider;
  chain: Chain;
  // isWebAuthnSupported(): boolean;
  registerPasskey(username: string): Promise<void>;
  authenticatePasskey(): Promise<AuthMethod>;
  getSimpleAccountOwner(): Promise<SimpleSmartAccountOwner>;
}

export interface SnowballSmartWallet {
  aaProvider: AAProvider;
  auth: SnowballAuth;
  getAddress(): Promise<Address>;
  sendUserOp(
    targetAddress: Address,
    data: Hex,
    sponsorGas: Boolean
  ): Promise<SendUserOperationResult>;
}

export class Snowball {
  private apiKey: string;
  private chain: Chain;
  private authProvider: AuthProvider;
  private aaProvider: AAProvider | undefined;

  public auth: SnowballAuth;
  public smartWallet: SnowballSmartWallet | undefined;

  constructor(apiKey: string, authProvider: AuthProvider, chain: Chain) {
    this.apiKey = apiKey;
    this.authProvider = authProvider;
    this.chain = chain;

    this.auth = this.initAuthProvider(authProvider);
  }

  initAuthProvider(
    authProvider: AuthProvider = this.authProvider
  ): SnowballAuth {
    this.authProvider = authProvider;
    switch (authProvider.name) {
      case Auth.lit:
        return new LitPasskey(this.chain, authProvider);
      case Auth.turnkey:
      case Auth.privy:
      default:
        throw new Error("Auth Provider has not been impl yet");
    }
  }

  async initAAProvider(aaProvider: AAProvider): Promise<SnowballSmartWallet> {
    this.aaProvider = aaProvider;
    switch (aaProvider.name) {
      case AA.alchemy:
        try {
          const simpleAccountOwner = await this.auth.getSimpleAccountOwner();
          this.smartWallet = new AlchemyAA(
            this.auth,
            simpleAccountOwner,
            aaProvider
          );

          return this.smartWallet;
        } catch (e) {
          throw e;
        }
      case AA.fun:
      default:
        throw new Error("Invalid auth provider");
    }
  }

  async sendUserOperation(
    targetAddress: Address,
    data: Hex,
    sponsorGas: Boolean
  ): Promise<SendUserOperationResult> {
    if (this.smartWallet === undefined) {
      throw new Error("Smart wallet not initialized");
    }

    return await this.smartWallet.sendUserOp(targetAddress, data, sponsorGas);
  }
}
