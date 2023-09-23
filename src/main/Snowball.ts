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
  isWebAuthnSupported(): boolean;
  registerPasskey(username: string): Promise<void>;
  authenticatePasskey(): Promise<AuthMethod>;
  getSimpleAccountOwner(): Promise<SimpleSmartAccountOwner>;
}

export interface SnowballSmartWallet<
  TTransport extends Transport | FallbackTransport = Transport
> extends ISmartAccountProvider<TTransport> {
  aaProvider: AAProvider;
  auth: SnowballAuth;
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
  private aaProvider: AAProvider;

  public auth: SnowballAuth;
  public smartWallet: SnowballSmartWallet | undefined;
  public address: Address | undefined;

  constructor(
    apiKey: string,
    authProvider: AuthProvider,
    aaProvider: AAProvider,
    chain: Chain
  ) {
    this.apiKey = apiKey;
    this.authProvider = authProvider;
    this.aaProvider = aaProvider;
    this.chain = chain;

    this.auth = this.initAuthProvider(authProvider);

    this.initAAProvider(aaProvider)
      .catch((e) => {
        throw e;
      })
      .then((smartWallet) => {
        this.smartWallet = smartWallet;
        smartWallet
          .getAddress()
          .catch((e) => {
            throw e;
          })
          .then((address) => {
            this.address = address;
          });
      });
  }

  initAuthProvider(
    authProvider: AuthProvider = this.authProvider
  ): SnowballAuth {
    switch (authProvider.name) {
      case Auth.lit:
        return new LitPasskey(this.chain, authProvider);
      case Auth.turnkey:
      case Auth.privy:
      default:
        throw new Error("Auth Provider has not been impl yet");
    }
  }

  async initAAProvider(
    aaProvider: AAProvider = this.aaProvider
  ): Promise<SnowballSmartWallet> {
    switch (aaProvider.name) {
      case AA.alchemy:
        try {
          const simpleAccountOwner = await this.auth.getSimpleAccountOwner();
          this.smartWallet = new AlchemyAA(
            this.auth,
            simpleAccountOwner,
            aaProvider
          );
          this.address = await this.smartWallet.getAddress();
          return this.smartWallet;
        } catch (e) {
          throw e;
        }
      case AA.fun:
      default:
        throw new Error("Invalid auth provider");
    }
  }

  async getSmartWalletAddress(): Promise<Address> {
    try {
      if (this.address) {
        return this.address;
      }

      if (this.smartWallet === undefined) {
        this.smartWallet = await this.initAAProvider();
      }

      return this.address!;
    } catch (e) {
      throw e;
    }
  }

  async sendUserOperation(
    targetAddress: Address,
    data: Hex,
    sponsorGas: Boolean
  ): Promise<SendUserOperationResult> {
    if (this.smartWallet === undefined) {
      this.smartWallet = await this.initAAProvider();
    }

    return await this.smartWallet.sendUserOp(targetAddress, data, sponsorGas);
  }
}
