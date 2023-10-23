import type { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import { Auth } from "../Auth";
export declare abstract class Passkey extends Auth {
    register(username: string): Promise<void>;
    authenticate(): Promise<void>;
    abstract registerPasskey(username: string): Promise<void>;
    abstract authenticatePasskey(): Promise<void>;
    abstract getEthersWallet(): Promise<PKPEthersWallet>;
}
