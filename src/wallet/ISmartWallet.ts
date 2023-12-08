import {
  UserOperationReceipt,
  UserOperationResponse,
  type Address,
} from "@alchemy/aa-core";
import type { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import { Hash, Hex } from "viem";
//import { SmartWalletProviderInfo } from "./types";
import { Chain } from "../helpers/chains";

/**
 * Interface for the SnowBall SDK Smart Wallet.
 */
export interface ISmartWallet {
  /** Ethers wallet associated with the smart wallet. */
  ethersWallet: PKPEthersWallet | undefined;

  /** Retrieves the address associated with this smart wallet. */
  getAddress(): Promise<Address>;

  /**
   * Switches the current chain.
   * @param chain The chain to switch to.
   */
  switchChain(chain: Chain): Promise<void>;

  /**
   * Sends a user operation.
   * @param target The target address.
   * @param data The data to send.
   * @param value The value to send, if any.
   * @returns The hash of the operation.
   */
  sendUserOperation(
    target: Address,
    data: Hex,
    value?: bigint,
  ): Promise<{ hash: string }>;

  /** Waits for a user operation transaction to complete. */
  waitForUserOperationTransaction(hash: Hash): Promise<Hash>;

  /** Retrieves a user operation by its hash. */
  getUserOperationByHash(hash: Hash): Promise<UserOperationResponse | null>;

  /** Retrieves a receipt for a user operation. */
  getUserOperationReceipt(hash: Hash): Promise<UserOperationReceipt | null>;
}
