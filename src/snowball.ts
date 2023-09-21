import type {
  SimpleSmartAccountOwner,
  Address,
  Hex,
  ISmartAccountProvider,
  SendUserOperationResult,
} from "@alchemy/aa-core";
import type { Chain } from "./helpers/chains";
import type { FallbackTransport, Transport } from "viem";

export interface SnowballAuth {
  chain: Chain;
  isWebAuthnSupported(): boolean;
  registerPasskey(username: string): Promise<void>;
  authenticatePasskey(): Promise<void>;
  getSimpleAccountOwner(chain: Chain): Promise<SimpleSmartAccountOwner>;
}

export interface SnowballSmartWallet<
  TTransport extends Transport | FallbackTransport = Transport
> extends ISmartAccountProvider<TTransport> {
  auth: SnowballAuth;
  sendUserOp(
    targetAddress: Address,
    data: Hex,
    sponsorGas: Boolean
  ): Promise<SendUserOperationResult>;
}

export class Snowball {
  public auth: SnowballAuth;
  public smartWallet: SnowballSmartWallet;

  constructor(smartWallet: SnowballSmartWallet) {
    this.auth = smartWallet.auth;
    this.smartWallet = smartWallet;
  }

  async getSmartWalletAddress(): Promise<Address> {
    return this.smartWallet.getAddress();
  }

  async sendUserOperation(
    targetAddress: Address,
    data: Hex,
    sponsorGas: Boolean
  ): Promise<SendUserOperationResult> {
    return this.smartWallet.sendUserOp(targetAddress, data, sponsorGas);
  }
}
