import { WalletClientSigner, type SmartAccountSigner } from "@alchemy/aa-core";

import { createWalletClient, custom } from "viem";

import { Auth } from "../auth";

import { LIT_RELAY_API_KEY } from "../helpers/env";
import { viemChain, type Chain } from "../helpers/chains";
import { AlchemyProvider } from "@alchemy/aa-alchemy";

export class LitSigner {
  private auth: Auth;
  private signer: SmartAccountSigner | null;
  private chain: Chain;

  constructor(auth: Auth, chain: Chain, signer: SmartAccountSigner) {
    this.auth = auth;
    this.chain = auth.chain;
    this.signer = null; // Assign initial value of null

    this.getLitSigner().then((litSigner) => {
      this.signer = litSigner;
    });
  }

  async getLitSigner(): Promise<SmartAccountSigner> {
    const provider = new AlchemyProvider({
      apiKey: LIT_RELAY_API_KEY,
      chain: viemChain(this.chain),
    });

    this.signer = new WalletClientSigner(
      createWalletClient({
        transport: custom(provider),
      }),
      "lit"
    );
    return this.signer;
  }
}
