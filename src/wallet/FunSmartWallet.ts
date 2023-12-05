/* eslint-disable */
import type { Address, Hex } from "viem";
import { UserOperationResponse, UserOperationReceipt } from "@alchemy/aa-core";
import { SmartWallet } from "./SmartWallet";
import type { ISmartWallet } from "./ISmartWallet";

export class FunSmartWallet extends SmartWallet implements ISmartWallet {
  async sendUserOperation(
    target: Address,
    data: Hex,
    value?: bigint,
  ): Promise<{ hash: string }> {
    throw new Error("Method not implemented.");
  }

  async getAddress(): Promise<`0x${string}`> {
    throw new Error("Method not implemented.");
  }

  async waitForUserOperationTransaction(
    _hash: `0x${string}`,
  ): Promise<`0x${string}`> {
    throw new Error("Method not implemented.");
  }

  async getUserOperationByHash(
    _hash: `0x${string}`,
  ): Promise<UserOperationResponse> {
    throw new Error("Method not implemented.");
  }

  async getUserOperationReceipt(
    _hash: `0x${string}`,
  ): Promise<UserOperationReceipt> {
    throw new Error("Method not implemented.");
  }

  async switchChain(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
