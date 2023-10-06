/* eslint-disable */
import type { Address } from "viem";
import { UserOperationResponse, UserOperationReceipt } from "@alchemy/aa-core";
import { SmartWallet } from "./SmartWallet";

export class FunSmartWallet extends SmartWallet {
  async sendUserOperation(
    _targetAddress: Address,
    _data: Address,
    _sponsorGas: boolean
  ): Promise<{ hash: string }> {
    throw new Error("Method not implemented.");
  }

  async getAddress(): Promise<`0x${string}`> {
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

  async switchChain(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
