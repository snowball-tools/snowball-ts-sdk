import { LitAuthClient, WebAuthnProvider } from "@lit-protocol/lit-auth-client";
import { ProviderType } from "@lit-protocol/constants";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import type {
  AuthMethod,
  AuthCallbackParams,
  IRelayPKP,
  SessionSigsMap,
  IRelayPollStatusResponse,
} from "@lit-protocol/types";
import { LitAbility, LitActionResource } from "@lit-protocol/auth-helpers";
import { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import type {
  SimpleSmartAccountOwner,
  Address,
  SignTypedDataParams,
} from "@alchemy/aa-core";
import type { TypedDataField } from "@ethersproject/abstract-signer";
import { DEFAULT_EXP, type AuthProvider } from "../helpers/constants";
import type { Chain } from "../helpers/chains";
import { Passkey } from "./Passkey";

export class LitPasskey extends Passkey {
  litAuthClient: LitAuthClient;
  webAuthnProvider: WebAuthnProvider;
  litNodeClient: LitNodeClient;

  private authenticated: AuthMethod | undefined;
  private pkpPublicKey: string | undefined;
  private pkpEthAddress: string | undefined;
  private sessionSig: SessionSigsMap | undefined;
  private pkpWallet: PKPEthersWallet | undefined;

  // to do: get setter
  public simpleAccountOwner: SimpleSmartAccountOwner | undefined;

  constructor(chain: Chain, authProvider: AuthProvider) {
    super(chain, authProvider);
    this.litAuthClient = new LitAuthClient({
      litRelayConfig: {
        relayApiKey: authProvider.apiKeys[`relayKey`],
      },
    });

    this.litAuthClient.initProvider(ProviderType.WebAuthn);

    this.webAuthnProvider = this.litAuthClient.getProvider(
      ProviderType.WebAuthn
    ) as WebAuthnProvider;

    this.litNodeClient = new LitNodeClient({
      litNetwork: "serrano",
      debug: false,
    });
  }

  async registerPasskey(username: string): Promise<void> {
    try {
      const options = await this.webAuthnProvider.register(username);
      const txHash = await this.webAuthnProvider.verifyAndMintPKPThroughRelayer(
        options
      );

      const response: IRelayPollStatusResponse =
        await this.webAuthnProvider.relay.pollRequestUntilTerminalState(txHash);

      if (
        response.pkpEthAddress === undefined ||
        response.pkpPublicKey === undefined
      ) {
        return Promise.reject(
          `pollRequestUntilTerminalState failed ${response}`
        );
      }

      this.pkpPublicKey = response.pkpPublicKey;
      this.pkpEthAddress = response.pkpEthAddress;

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(`registerPasskey failed: ${error}`);
    }
  }

  async authenticatePasskey(): Promise<AuthMethod> {
    try {
      this.authenticated = await this.webAuthnProvider.authenticate();

      return this.authenticated;
    } catch (error) {
      return Promise.reject(`Authentication failed ${error}`);
    }
  }

  async fetchPkpsForAuthMethod(): Promise<IRelayPKP[]> {
    try {
      if (this.authenticated === undefined) {
        this.authenticated = await this.authenticatePasskey();
      }

      const pkps = await this.webAuthnProvider.fetchPKPsThroughRelayer(
        this.authenticated
      );

      if (pkps.length === 0 || pkps === undefined) {
        return Promise.reject("No PKPs found");
      }

      this.pkpPublicKey = pkps[0].publicKey;
      this.pkpEthAddress = pkps[0].ethAddress;

      return pkps;
    } catch (error) {
      return Promise.reject(`Retrieving PKPs failed ${error}`);
    }
  }

  async getSessionSigs(): Promise<SessionSigsMap> {
    try {
      if (this.pkpPublicKey === undefined) {
        this.pkpPublicKey = await this.fetchPkpsForAuthMethod()
          .catch((error) => {
            return Promise.reject(`Transaction failed ${error}`);
          })
          .then((pkps: IRelayPKP[]) => {
            return pkps[0].publicKey;
          });
      }

      await this.litNodeClient.connect();

      const authNeededCallback = async (params: AuthCallbackParams) => {
        const resp = await this.litNodeClient.signSessionKey({
          statement: params.statement,
          authMethods: [this.authenticated!],
          pkpPublicKey: this.pkpPublicKey,
          expiration: params.expiration,
          resources: params.resources,
          chainId: this.chain.chainId,
        });
        return resp.authSig;
      };

      this.sessionSig = await this.litNodeClient.getSessionSigs({
        expiration: DEFAULT_EXP,
        chain: this.chain.name,
        resourceAbilityRequests: [
          {
            resource: new LitActionResource("*"),
            ability: LitAbility.PKPSigning,
          },
        ],
        switchChain: false,
        authNeededCallback: authNeededCallback,
      });

      if (this.sessionSig === undefined) {
        return Promise.reject("No session sigs found");
      }

      return this.sessionSig!;
    } catch (error) {
      return Promise.reject(`Retrieving session sigs failed ${error}`);
    }
  }

  async createPkpEthersWallet(): Promise<PKPEthersWallet> {
    if (this.sessionSig === undefined) {
      this.sessionSig = await this.getSessionSigs();
    }

    try {
      this.pkpWallet = new PKPEthersWallet({
        controllerSessionSigs: this.sessionSig,
        pkpPubKey: this.pkpPublicKey!,
        rpc: "https://chain-rpc.litprotocol.com/http",
      });
      await this.pkpWallet.init();

      return this.pkpWallet;
    } catch (error) {
      return Promise.reject(`Transaction failed ${error}`);
    }
  }

  async getSimpleAccountOwner(): Promise<SimpleSmartAccountOwner> {
    if (this.simpleAccountOwner) {
      return this.simpleAccountOwner;
    }

    try {
      if (this.pkpWallet === undefined) {
        this.pkpWallet = await this.createPkpEthersWallet();
      }

      const owner: SimpleSmartAccountOwner = {
        signMessage: async (msg: Uint8Array) => {
          return (await this.pkpWallet!.signMessage(msg)) as Address;
        },
        getAddress: async () => {
          return (await this.pkpWallet!.getAddress()) as Address;
        },
        signTypedData: async (params: SignTypedDataParams) => {
          const types: Record<string, Array<TypedDataField>> = {
            [params.primaryType]: params.types["x"].map(
              (value) =>
                ({
                  name: value.name,
                  type: value.type,
                } as TypedDataField)
            ),
          };

          return (await this.pkpWallet!._signTypedData(
            params.domain ? params.domain : {},
            types,
            params.message
          )) as Address;
        },
      };

      this.simpleAccountOwner = owner;

      return owner;
    } catch (error) {
      return Promise.reject(`Get Simple Account Owner failed ${error}`);
    }
  }
}
