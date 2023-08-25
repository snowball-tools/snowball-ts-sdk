import { AuthMethod } from "@lit-protocol/types";
declare class SnowballAuth {
    private litAuthClient;
    private webAuthnProvider;
    constructor(apiKey: string);
    registerPasskey(username: string): Promise<{
        pkpEthAddress: string;
        pkpPublicKey: string;
    }>;
    authenticatePasskey(): Promise<AuthMethod>;
}
export default SnowballAuth;
