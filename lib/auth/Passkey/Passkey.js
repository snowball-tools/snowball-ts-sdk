"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Passkey = void 0;
const Auth_1 = require("../Auth");
class Passkey extends Auth_1.Auth {
    async register(username) {
        try {
            await this.registerPasskey(username);
        }
        catch (error) {
            return Promise.reject(`[SnowballPasskey] register failed: ${JSON.stringify(error)}`);
        }
    }
    async authenticate() {
        try {
            await this.authenticatePasskey();
        }
        catch (error) {
            return Promise.reject(`[SnowballPasskey] authenticate failed: ${JSON.stringify(error)}`);
        }
    }
}
exports.Passkey = Passkey;
