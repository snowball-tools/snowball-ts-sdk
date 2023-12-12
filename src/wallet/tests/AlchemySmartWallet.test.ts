import { LocalAccountSigner, SmartAccountSigner } from "@alchemy/aa-core";
import { getDefaultLightAccountFactoryAddress } from "@alchemy/aa-accounts";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { sepolia } from "viem/chains";
import { LightSmartContractAccount } from "@alchemy/aa-accounts";
import "dotenv/config";
import { AuthProviderInfo } from "../../auth";
import { AuthProvider } from "../../auth/base";
import { CHAINS } from "../../helpers/chains";
import { AlchemySmartWallet } from "../AlchemySmartWallet";

describe("Alchemy Smart Wallet Tests", () => {
  let directProvider: AlchemyProvider;
  const alchemyProviderChain = sepolia;

  const dummyMnemonic =
    "test test test test test test test test test test test test";
  const owner: SmartAccountSigner =
    LocalAccountSigner.mnemonicToAccountSigner(dummyMnemonic);

  let alchemySmartWalletProvider: AlchemyProvider;
  //let alchemySmartWalletAuth: Auth;
  let alchemySmartWallet: AlchemySmartWallet;

  beforeEach(() => {
    // cannot create an abstract class
    let mockAuthProviderInfo: AuthProviderInfo = {
      name: AuthProvider.lit,
      apiKeys: {
        /* relevant keys */
      },
    };

    // directly create a alchemy provider connected to a light account
    directProvider = new AlchemyProvider({
      apiKey: process.env["ALCHEMY_SEPOLIA_API_KEY"]!,
      chain: alchemyProviderChain,
    }).connect(
      (rpcClient) =>
        new LightSmartContractAccount({
          rpcClient: rpcClient,
          owner: owner,
          chain: alchemyProviderChain,
          factoryAddress:
            getDefaultLightAccountFactoryAddress(alchemyProviderChain),
        }),
    );

    // alchemy smart wallet provider (not light account) used to create alchemy smart wallet,
    // which itself is connected to a light account
    alchemySmartWalletProvider = new AlchemyProvider({
      apiKey: process.env["ALCHEMY_SEPOLIA_API_KEY"]!,
      chain: alchemyProviderChain,
    });

    alchemySmartWallet = new AlchemySmartWallet(
      CHAINS.sepolia,
      mockAuthProviderInfo,
      alchemySmartWalletProvider,
      owner,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should correctly sign the message", async () => {
    expect(
      await directProvider.signMessage(
        "0xa70d0af2ebb03a44dcd0714a8724f622e3ab876d0aa312f0ee04823285d6fb1b",
      ),
    ).toBe(
      "0x33b1b0d34ba3252cd8abac8147dc08a6e14a6319462456a34468dd5713e38dda3a43988460011af94b30fa3efefcf9d0da7d7522e06b7bd8bff3b65be4aee5b31c",
    );
    expect(
      await alchemySmartWallet.signMessage(
        "0xa70d0af2ebb03a44dcd0714a8724f622e3ab876d0aa312f0ee04823285d6fb1b",
      ),
    ).toBe(
      "0x33b1b0d34ba3252cd8abac8147dc08a6e14a6319462456a34468dd5713e38dda3a43988460011af94b30fa3efefcf9d0da7d7522e06b7bd8bff3b65be4aee5b31c",
    );
  });

  it("should sign typed data successfully", async () => {
    const typedData = {
      types: {
        Request: [{ name: "hello", type: "string" }],
      },
      primaryType: "Request",
      message: {
        hello: "world",
      },
    };
    expect(await directProvider.signTypedData(typedData)).toBe(
      await owner.signTypedData(typedData),
    );
    expect(await alchemySmartWallet.signTypedData(typedData)).toBe(
      await owner.signTypedData(typedData),
    );
  });
});
