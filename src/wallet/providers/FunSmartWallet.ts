import type { Address } from "viem";
import type { Chain, SmartWalletProviderInfo } from "../../helpers";
import type { SnowballSmartWalletProvider } from "./types";
import { UserOperationResponse, UserOperationReceipt } from "@alchemy/aa-core";

export class FunSmartWallet implements SnowballSmartWalletProvider {
  chain: Chain;
  smartWalletProviderInfo: SmartWalletProviderInfo;

  constructor(chain: Chain, smartWalletProviderInfo: SmartWalletProviderInfo) {
    this.chain = chain;
    this.smartWalletProviderInfo = smartWalletProviderInfo;
  }

  sendUserOperation(
    _targetAddress: Address,
    _data: Address,
    _sponsorGas: Boolean
  ): Promise<{ hash: string }> {
    throw new Error("Method not implemented.");
  }

  changeChain(_chain: Chain) {
    throw new Error("Method not implemented.");
  }

  async waitForUserOperationTransaction(
    _hash: `0x${string}`
  ): Promise<`0x${string}`> {
    throw new Error("Method not implemented.");
  }

  async getUserOperationByHash(
    _hash: `0x${string}`
  ): Promise<UserOperationResponse> {
    throw new Error("Method not implemented.");
  }

  async getUserOperationReceipt(
    _hash: `0x${string}`
  ): Promise<UserOperationReceipt> {
    throw new Error("Method not implemented.");
  }
}
