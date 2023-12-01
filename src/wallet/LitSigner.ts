import { WalletClientSigner, type SmartAccountSigner } from "@alchemy/aa-core";

import { createWalletClient, custom } from "viem";

import { Auth } from "../auth";

import { LIT_RELAY_API_KEY } from "../helpers/env";
import { viemChain, type Chain } from "../helpers/chains";
import { AlchemyProvider } from "@alchemy/aa-alchemy";

export class LitSigner {
  private auth: Auth;
  private signer: SmartAccountSigner;
  private chain: Chain;

  constructor(auth: Auth, chain: Chain, provider: AlchemyProvider) {
    this.auth = auth;
    this.chain = auth.chain;

    this.getLitSigner(provider).then((litSigner) => {
      this.signer = litSigner;
    });
  }

  private async getLitSigner(
    provider: AlchemyProvider
  ): Promise<SmartAccountSigner> {
    const walletClient = createWalletClient({
      transport: custom(provider),
    });

    const litSigner = new WalletClientSigner(walletClient, "lit");

    return litSigner;
  }

  // async getLitSigner(provider: AlchemyProvider): Promise<SmartAccountSigner> {
  //   this.signer = new WalletClientSigner(
  //     createWalletClient({
  //       transport: custom(provider),
  //     }),
  //     "lit"
  //   );
  //   return this.signer;
  // }
}
