import { BaseSmartContractAccount, SmartAccountSigner } from "@alchemy/aa-core";
import {
  LightSmartContractAccount,
  getDefaultLightAccountFactoryAddress,
} from "@alchemy/aa-accounts";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { Chain, viemChain } from "../helpers/chains";
import { Auth } from "../auth/Auth";
import { SmartWalletProviderInfo } from "./types";
import { LitSigner } from "./LitSigner";

import { Hash, Hex } from "viem";

export abstract class BaseSmartContractAccountWrapper extends BaseSmartContractAccount {
  auth: Auth;
  lightAccount: LightSmartContractAccount | undefined;
  smartWalletProviderInfo: SmartWalletProviderInfo;
  chain: Chain;
  provider: AlchemyProvider;
  litSigner: LitSigner | undefined;

  constructor(
    auth: Auth,
    smartWalletProviderInfo: SmartWalletProviderInfo,
    provider: AlchemyProvider,
    signer: SmartAccountSigner
  ) {
    super({
      chain: viemChain(auth.chain),
      rpcClient: provider.rpcClient,
      factoryAddress: getDefaultLightAccountFactoryAddress(
        viemChain(auth.chain)
      ),
    });

    this.chain = auth.chain;
    this.auth = auth;
    this.smartWalletProviderInfo = smartWalletProviderInfo;
    this.provider = provider;
  }

  override async getInitCode(): Promise<Hex> {
    if (!this.lightAccount) {
      throw new Error("Light account is not initialized");
    }
    return this.lightAccount.getInitCode();
  }

  override getDummySignature(): `0x${string}` {
    return "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c";
  }

  // Implement the abstract method
  override async encodeExecute(
    target: string,
    value: bigint,
    data: string
  ): Promise<Hash> {
    // TODO: Encode the execute method call
    return "0x";
  }

  // Implement the abstract method
  override async signMessage(msg: string | Uint8Array): Promise<Hash> {
    // TODO: Sign the message
    return "0x";
  }

  // Implement the abstract method
  override async getAccountInitCode(): Promise<Hash> {
    // TODO: Return the account init code
    return "0x";
  }
}
