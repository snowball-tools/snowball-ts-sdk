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

export interface SnowballSmartWallet {
  getSmartWalletAddress(): Promise<Address>;
  gasEstimator(
    struct: Deferrable<UserOperationStruct>
  ): Promise<Deferrable<UserOperationStruct>>;
  sendUserOperation(
    targetAddress: Address,
    data: Hex,
    sponsorGas: Boolean
  ): Promise<Boolean>;
}

class Snowball {
  public auth: SnowballAuth;
  public smartWallet: SnowballSmartWallet;

  constructor(auth: SnowballAuth, smartWallet: SnowballSmartWallet) {
    this.auth = auth;
    this.smartWallet = smartWallet;
  }

  async getSmartWalletAddress(): Promise<Address> {
    return this.smartWallet.getSmartWalletAddress();
  }

  async sendUserOperation(
    targetAddress: Address,
    data: Hex,
    sponsorGas: Boolean
  ): Promise<Boolean> {
    return this.smartWallet.sendUserOperation(targetAddress, data, sponsorGas);
  }
}
