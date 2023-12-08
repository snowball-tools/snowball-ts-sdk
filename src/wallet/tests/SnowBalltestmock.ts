// import { LocalAccountSigner, SmartAccountSigner } from "@alchemy/aa-core";
// import { type Chain } from "viem";
// import { getDefaultLightAccountFactoryAddress } from "@alchemy/aa-accounts";
// import { AlchemyProvider } from "@alchemy/aa-alchemy";
// import { sepolia } from "viem/chains";

// ("../../index.js");
// import { LightSmartContractAccount } from "@alchemy/aa-accounts";
// import { API_KEY } from "./constants";

// import { Snowball } from "../../snowball";
// import { AuthProvider } from "../../auth";
// import { SmartWalletProvider } from "../base";
// import { CHAINS } from "../../helpers/chains";
// const chain = sepolia;

// describe("Snowball Light Account Tests", () => {
//   let snowball: Snowball;
//   let mockApiKey = "test-api-key";
//   let mockChain = CHAINS.sepolia;
//   let mockAuthProviderInfo = {
//     name: AuthProvider.lit,
//     apiKeys: {
//       /* relevant keys */
//     },
//   };
//   let mockSmartWalletProviderInfo = {
//     name: SmartWalletProvider.alchemy,
//     apiKeys: {
//       /* relevant keys */
//     },
//   };
//   let directProvider: AlchemyProvider;

//   const dummyMnemonic =
//     "test test test test test test test test test test test test";
//   const owner: SmartAccountSigner =
//     LocalAccountSigner.mnemonicToAccountSigner(dummyMnemonic);

//   beforeEach(() => {
//     directProvider = getProviderConnectedToLightAccount({ owner, chain });

//     snowball = new Snowball(
//       mockApiKey,
//       mockChain,
//       mockAuthProviderInfo,
//       mockSmartWalletProviderInfo,
//     );
//   });

//   test("constructor initializes correctly", () => {
//     expect(snowball).toBeDefined();
//     expect(directProvider).toBeDefined();
//     // Further assertions to verify the initial state of the snowball instance
//   });

//   //   it("should correctly sign the message", async () => {
//   //     const provider = givenConnectedProvider({ owner, chain });
//   //     expect(
//   //       await provider.signMessage(
//   //         "0xa70d0af2ebb03a44dcd0714a8724f622e3ab876d0aa312f0ee04823285d6fb1b",
//   //       ),
//   //     ).toBe(
//   //       "0x33b1b0d34ba3252cd8abac8147dc08a6e14a6319462456a34468dd5713e38dda3a43988460011af94b30fa3efefcf9d0da7d7522e06b7bd8bff3b65be4aee5b31c",
//   //     );
//   //   });

//   //   it("should correctly sign typed data", async () => {
//   //     const provider = givenConnectedProvider({ owner, chain });
//   //     expect(
//   //       await provider.signTypedData({
//   //         types: {
//   //           Request: [{ name: "hello", type: "string" }],
//   //         },
//   //         primaryType: "Request",
//   //         message: {
//   //           hello: "world",
//   //         },
//   //       }),
//   //     ).toBe(
//   //       "0xda1aeed13916d5723579f26cb9116155945d3581d642c38d8e2bce9fc969014f3eb599fa375df3d6e8181c8f04db64819186ac44cf5fd2bdd90e9f8543c579461b",
//   //     );
//   //   });

//   //   it("should correctly encode transferOwnership data", async () => {
//   //     expect(
//   //       LightSmartContractAccount.encodeTransferOwnership(
//   //         "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
//   //       ),
//   //     ).toBe(
//   //       "0xf2fde38b000000000000000000000000deadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
//   //     );
//   //   });

//   //   it("should correctly encode batch transaction data", async () => {
//   //     const provider = givenConnectedProvider({ owner, chain });
//   //     const data = [
//   //       {
//   //         target: "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
//   //         data: "0xdeadbeef",
//   //       },
//   //       {
//   //         target: "0x8ba1f109551bd432803012645ac136ddd64dba72",
//   //         data: "0xcafebabe",
//   //       },
//   //     ] satisfies BatchUserOperationCallData;

//   //     expect(
//   //       await provider.account.encodeBatchExecute(data),
//   //     ).toMatchInlineSnapshot(
//   //       '"0x18dfb3c7000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000deadbeefdeadbeefdeadbeefdeadbeefdeadbeef0000000000000000000000008ba1f109551bd432803012645ac136ddd64dba720000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000004deadbeef000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004cafebabe00000000000000000000000000000000000000000000000000000000"',
//   //     );
//   //   });

//   //   it("should successfully get counterfactual address", async () => {
//   //     const provider = givenConnectedProvider({ owner, chain });
//   //     expect(await provider.getAddress()).toMatchInlineSnapshot(
//   //       '"0x1a3a89cd46f124EF40848966c2D7074a575dbC27"',
//   //     );
//   //   });

//   //   it("should sign typed data successfully", async () => {
//   //     const provider = givenConnectedProvider({ owner, chain });
//   //     const typedData = {
//   //       types: {
//   //         Request: [{ name: "hello", type: "string" }],
//   //       },
//   //       primaryType: "Request",
//   //       message: {
//   //         hello: "world",
//   //       },
//   //     };
//   //     expect(await provider.signTypedData(typedData)).toBe(
//   //       await owner.signTypedData(typedData),
//   //     );
//   //   });

//   //   it("should sign message successfully", async () => {
//   //     const provider = givenConnectedProvider({ owner, chain });
//   //     expect(await provider.signMessage("test")).toBe(
//   //       await owner.signMessage("test"),
//   //     );
//   //   });

//   //   it("should sign typed data with 6492 successfully for undeployed account", async () => {
//   //     const undeployedProvider = givenConnectedProvider({
//   //       owner: undeployedOwner,
//   //       chain,
//   //     });
//   //     const typedData = {
//   //       types: {
//   //         Request: [{ name: "hello", type: "string" }],
//   //       },
//   //       primaryType: "Request",
//   //       message: {
//   //         hello: "world",
//   //       },
//   //     };
//   //     expect(
//   //       await undeployedProvider.signTypedDataWith6492(typedData),
//   //     ).toMatchInlineSnapshot(
//   //       '"0x00000000000000000000000000000055c0b4fa41dde26a74435ff03692292fbd000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000445fbfb9cf000000000000000000000000ef9d7530d16df66481adf291dc9a12b44c7f7df00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000041591a9422219a5f2bc87ee24a82a6d5ef9674bf7408a2a289984de258466d148e75efb65b487ffbfcb061b268b1b667d8d7d4eac2c3d9d2d0a52d49c891be567c1c000000000000000000000000000000000000000000000000000000000000006492649264926492649264926492649264926492649264926492649264926492"',
//   //     );
//   //   });

//   //   it("should sign message with 6492 successfully for undeployed account", async () => {
//   //     const undeployedProvider = givenConnectedProvider({
//   //       owner: undeployedOwner,
//   //       chain,
//   //     });
//   //     expect(
//   //       await undeployedProvider.signMessageWith6492("test"),
//   //     ).toMatchInlineSnapshot(
//   //       '"0x00000000000000000000000000000055c0b4fa41dde26a74435ff03692292fbd000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000445fbfb9cf000000000000000000000000ef9d7530d16df66481adf291dc9a12b44c7f7df00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000041be34ecce63c5248d5cda407e7da319be3c861e6e2c5d30c9630cd35dcb55e56205c482503552883923f79e751ea3671cbb84d65b18af33cd3034aeb7d529da9a1b000000000000000000000000000000000000000000000000000000000000006492649264926492649264926492649264926492649264926492649264926492"',
//   //     );
//   //   });

//   //   /**
//   //    * Need to add test eth to the counterfactual address for this test to pass.
//   //    * For current balance, @see: https://sepolia.etherscan.io/address/0x7eDdc16B15259E5541aCfdebC46929873839B872
//   //    */
//   //   it("should execute successfully", async () => {
//   //     const provider = givenConnectedProvider({ owner, chain });
//   //     const result = await provider.sendUserOperation({
//   //       target: await provider.getAddress(),
//   //       data: "0x",
//   //     });
//   //     const txnHash = provider.waitForUserOperationTransaction(
//   //       result.hash as Hash,
//   //     );

//   //     await expect(txnHash).resolves.not.toThrowError();
//   //   }, 50000);

//   //   it("should fail to execute if account address is not deployed and not correct", async () => {
//   //     const accountAddress = "0xc33AbD9621834CA7c6Fc9f9CC3c47b9c17B03f9F";
//   //     const newProvider = givenConnectedProvider({
//   //       owner,
//   //       chain,
//   //       accountAddress,
//   //     });

//   //     const result = newProvider.sendUserOperation({
//   //       target: await newProvider.getAddress(),
//   //       data: "0x",
//   //     });

//   //     await expect(result).rejects.toThrowError();
//   //   });

//   //   it("should get counterfactual for undeployed account", async () => {
//   //     const owner =
//   //       LocalAccountSigner.privateKeyToAccountSigner(generatePrivateKey());
//   //     const provider = givenConnectedProvider({ owner, chain });

//   //     const address = provider.getAddress();
//   //     await expect(address).resolves.not.toThrowError();
//   //     expect(isAddress(await address)).toBe(true);
//   //   });

//   //   it("should get owner successfully", async () => {
//   //     const provider = givenConnectedProvider({ owner, chain });
//   //     expect(await provider.account.getOwnerAddress()).toMatchInlineSnapshot(
//   //       '"0x65eaA2AfDF6c97295bA44C458abb00FebFB3a5FA"',
//   //     );
//   //     expect(await provider.account.getOwnerAddress()).toBe(
//   //       await owner.getAddress(),
//   //     );
//   //   });

//   //   it("should transfer ownership successfully", async () => {
//   //     const provider = givenConnectedProvider({
//   //       owner,
//   //       chain,
//   //       feeOpts: {
//   //         baseFeeBufferPercent: 50n,
//   //         maxPriorityFeeBufferPercent: 50n,
//   //         preVerificationGasBufferPercent: 50n,
//   //       },
//   //     });
//   //     // create a throwaway address
//   //     const throwawayOwner =
//   //       LocalAccountSigner.privateKeyToAccountSigner(generatePrivateKey());
//   //     const throwawayProvider = givenConnectedProvider({
//   //       owner: throwawayOwner,
//   //       chain,
//   //     });

//   //     // fund the throwaway address
//   //     const fundThrowawayResult = await provider.sendUserOperation({
//   //       target: await throwawayProvider.getAddress(),
//   //       data: "0x",
//   //       value: 10000000000000n,
//   //     });
//   //     const fundThrowawayTxnHash = provider.waitForUserOperationTransaction(
//   //       fundThrowawayResult.hash,
//   //     );
//   //     await expect(fundThrowawayTxnHash).resolves.not.toThrowError();

//   //     // create new owner and transfer ownership
//   //     const newThrowawayOwner =
//   //       LocalAccountSigner.privateKeyToAccountSigner(generatePrivateKey());
//   //     const result = await LightSmartContractAccount.transferOwnership(
//   //       throwawayProvider,
//   //       newThrowawayOwner,
//   //     );
//   //     const txnHash = throwawayProvider.waitForUserOperationTransaction(result);
//   //     await expect(txnHash).resolves.not.toThrowError();

//   //     expect(await throwawayProvider.account.getOwnerAddress()).not.toBe(
//   //       await throwawayOwner.getAddress(),
//   //     );
//   //     expect(await throwawayProvider.account.getOwnerAddress()).toBe(
//   //       await newThrowawayOwner.getAddress(),
//   //     );
//   //   }, 100000);
// });

// const getProviderConnectedToLightAccount = ({
//   owner,
//   chain,
// }: {
//   owner: SmartAccountSigner;
//   chain: Chain;
// }) => {
//   const provider = new AlchemyProvider({
//     apiKey: API_KEY!,
//     chain,
//   }).connect(
//     (rpcClient) =>
//       new LightSmartContractAccount({
//         chain,
//         owner,
//         factoryAddress: getDefaultLightAccountFactoryAddress(chain),
//         rpcClient,
//       }),
//   );

//   return provider;
// };

// //  getSnowBall = ({
// //     // const authProviderInfo: AuthProviderInfo = {
// //     //     name: "passkey",
// //     //     apiKeys:
// //     // };

// //      const snowball = {
// //         apiKey: "snowball-test",
// //         chain: chain,
// //         authProviderInfo: {
// //             name: AuthProvider.lit,
// //           },

// //         SmartWalletProviderInfo:  {
// //             name: SmartWalletProvider.alchemy,
// //             apiKeys: {
// //               [AlchemySmartWalletProviderKey.ethereumGoerli]: ALCHEMY_GOERLI_API_KEY,
// //               [AlchemySmartWalletProviderKey.ethereumGoerli_gasPolicyId]:
// //                 ALCHEMY_GOERLI_GAS_POLICY_ID,
// //               [AlchemySmartWalletProviderKey.ethereumSepolia]: ALCHEMY_SEPOLIA_API_KEY,
// //               [AlchemySmartWalletProviderKey.ethereumSepolia_gasPolicyId]:
// //                 ALCHEMY_SEPOLIA_GAS_POLICY_ID,
// //             },
// //           },

// //     },
// // })

// // const getAlchemySmartWalletProvider = ({
// //      auth: Auth = new Auth({

// // }),
// // })
