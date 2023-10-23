import { type Address, type SendUserOperationResult, type Hex, UserOperationResponse, UserOperationReceipt } from "@alchemy/aa-core";
import { SmartWallet } from "./SmartWallet";
export declare class AlchemySmartWallet extends SmartWallet {
    private provider;
    getAddress(): Promise<Address>;
    sendUserOperation(targetAddress: Address, data: Hex, sponsorGas: boolean): Promise<SendUserOperationResult>;
    private initAlchemyProvider;
    waitForUserOperationTransaction(hash: `0x${string}`): Promise<`0x${string}`>;
    getUserOperationByHash(hash: `0x${string}`): Promise<UserOperationResponse>;
    getUserOperationReceipt(hash: `0x${string}`): Promise<UserOperationReceipt>;
    switchChain(): Promise<void>;
}
