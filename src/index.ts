import {
  SimpleSmartAccountOwner,
  Address,
  Hex,
  UserOperationStruct,
  Deferrable,
} from "@alchemy/aa-core";
import { Chain } from "./helpers/chains";

export interface SnowballAuth {
  chain: Chain;
  isWebAuthnSupported(): boolean;
  registerPasskey(username: string): Promise<void>;
  authenticatePasskey(): Promise<void>;
  getSimpleAccountOwner(chain: Chain): Promise<SimpleSmartAccountOwner>;
}

export interface SnowballSmartWallet extends SimpleSmartAccountOwner {
  auth: SnowballAuth;
  sendUserOp(
    targetAddress: Address,
    data: Hex,
    sponsorGas: Boolean
  ): Promise<Boolean>;
}

class Snowball {
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
  ): Promise<Boolean> {
    return this.smartWallet.sendUserOp(targetAddress, data, sponsorGas);
  }
}
