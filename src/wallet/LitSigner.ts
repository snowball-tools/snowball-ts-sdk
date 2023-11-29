import { WalletClientSigner, type SmartAccountSigner } from "@alchemy/aa-core";
import { LitAbility, LitActionResource } from "@lit-protocol/auth-helpers";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import { AuthCallbackParams } from "@lit-protocol/types";
import { createWalletClient, custom } from "viem";
import { polygonMumbai } from "viem/chains";
import { Auth } from "../auth";
import { LitPasskey } from "../auth";
import { LIT_RELAY_API_KEY } from "../helpers/env";
import { viemChain, type Chain } from "../helpers/chains";
import { AlchemyProvider } from "@alchemy/aa-alchemy";

export class LitSigner {
  private auth: Auth;
  private signer: SmartAccountSigner;
  private chain: Chain;

  constructor(auth: Auth, signer: SmartAccountSigner) {
    this.auth = auth;
    this.chain = auth.chain;
    this.signer = signer;
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
