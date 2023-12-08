import { LocalAccountSigner, SmartAccountSigner } from "@alchemy/aa-core";
import { type Chain } from "viem";
import { getDefaultLightAccountFactoryAddress } from "@alchemy/aa-accounts";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { sepolia } from "viem/chains";

("../../index.js");
import { LightSmartContractAccount } from "@alchemy/aa-accounts";
import { API_KEY } from "./constants";

import { AlchemySmartWallet } from "../AlchemySmartWallet";
import { Auth } from "../../auth";
import { SmartWalletProviderInfo } from "../types";

const chain = sepolia;

describe("Alchemy Smart Wallet Tests", () => {
  let directProvider: AlchemyProvider;

  const dummyMnemonic =
    "test test test test test test test test test test test test";
  const owner: SmartAccountSigner =
    LocalAccountSigner.mnemonicToAccountSigner(dummyMnemonic);

  let alchemySmartWalletProvider: AlchemyProvider;
  let alchemySmartWalletAuth: Auth;
  let alchemySmartWalletProviderInfo: SmartWalletProviderInfo;
  let alchemySmartWalletSigner: SmartAccountSigner;
  let alchemySmartWallet: AlchemySmartWallet;

  beforeEach(() => {
    directProvider = getProviderConnectedToLightAccount({ owner, chain });

    alchemySmartWalletProvider = new AlchemyProvider({
      apiKey: API_KEY!,
      chain,
    });

    alchemySmartWalletProviderInfo = {
      name: SmartWalletProvider.alchemy,
      apiKeys: {
        [AlchemySmartWalletProviderKey.ethereumGoerli]: ALCHEMY_GOERLI_API_KEY,
        [AlchemySmartWalletProviderKey.ethereumGoerli_gasPolicyId]:
          ALCHEMY_GOERLI_GAS_POLICY_ID,
        [AlchemySmartWalletProviderKey.ethereumSepolia]:
          ALCHEMY_SEPOLIA_API_KEY,
        [AlchemySmartWalletProviderKey.ethereumSepolia_gasPolicyId]:
          ALCHEMY_SEPOLIA_GAS_POLICY_ID,
      },
    };

    alchemySmartWallet = new AlchemySmartWallet(
      alchemySmartWalletAuth,
      alchemySmartWalletProviderInfo,
      alchemySmartWalletProvider,
      owner,
    );
  });

  const getProviderConnectedToLightAccount = ({
    owner,
    chain,
  }: {
    owner: SmartAccountSigner;
    chain: Chain;
  }) => {
    const provider = new AlchemyProvider({
      apiKey: API_KEY!,
      chain,
    }).connect(
      (rpcClient) =>
        new LightSmartContractAccount({
          chain,
          owner,
          factoryAddress: getDefaultLightAccountFactoryAddress(chain),
          rpcClient,
        }),
    );

    return provider;
  };

  test.only("get owner address", () => {
    expect(alchemySmartWallet.getOwnerAddress()).toBe(
      alchemySmartWalletSigner.getAddress(),
    );
    expect(directProvider.getAddress()).toBe(owner.getAddress());
  });
});
