import {
  UserOperationReceipt,
  UserOperationResponse,
  type Address,
} from "@alchemy/aa-core";
import type { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import { Hash, Hex } from "viem";
import { Auth } from "../auth/Auth";
import { SmartWalletProviderInfo } from "./types";

export interface ISmartWalletV2 {
  ethersWallet: PKPEthersWallet | undefined;
  auth: Auth;
  address: Address | undefined;
  smartWalletProviderInfo: SmartWalletProviderInfo;

  getAddress(): Promise<Address>;
  switchChain(): Promise<void>;
  sendUserOperation(
    targetAddress: Address,
    data: Hex,
    sponsorGas: boolean
  ): Promise<{
    hash: string;
  }>;
  waitForUserOperationTransaction(hash: Hash): Promise<Hash>;
  getUserOperationByHash(hash: Hash): Promise<UserOperationResponse>;
  getUserOperationReceipt(hash: Hash): Promise<UserOperationReceipt>;
}
