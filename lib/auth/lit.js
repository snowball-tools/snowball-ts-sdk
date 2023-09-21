"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var lit_auth_client_1 = require("@lit-protocol/lit-auth-client");
var constants_1 = require("@lit-protocol/constants");
var lit_node_client_1 = require("@lit-protocol/lit-node-client");
var auth_helpers_1 = require("@lit-protocol/auth-helpers");
var pkp_ethers_1 = require("@lit-protocol/pkp-ethers");
var constants_2 = require("../helpers/constants");
var passkey_1 = require("./passkey");
var LitAuth = /** @class */ (function (_super) {
    __extends(LitAuth, _super);
    function LitAuth(apiKey, chain) {
        var _this = _super.call(this, chain) || this;
        _this.litAuthClient = new lit_auth_client_1.LitAuthClient({
            litRelayConfig: {
                relayApiKey: apiKey,
            },
        });
        _this.litAuthClient.initProvider(constants_1.ProviderType.WebAuthn);
        _this.webAuthnProvider = _this.litAuthClient.getProvider(constants_1.ProviderType.WebAuthn);
        _this.litNodeClient = new lit_node_client_1.LitNodeClient({
            litNetwork: "serrano",
            debug: false,
        });
        return _this;
    }
    LitAuth.prototype.registerPasskey = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var options, txHash, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.webAuthnProvider.register(username)];
                    case 1:
                        options = _a.sent();
                        return [4 /*yield*/, this.webAuthnProvider.verifyAndMintPKPThroughRelayer(options)];
                    case 2:
                        txHash = _a.sent();
                        return [4 /*yield*/, this.webAuthnProvider.relay
                                .pollRequestUntilTerminalState(txHash)
                                .catch(function (error) {
                                return Promise.reject("pollRequestUntilTerminalState failed ".concat(error));
                            })
                                .then(function (response) {
                                if (response.pkpEthAddress === undefined ||
                                    response.pkpPublicKey === undefined) {
                                    return Promise.reject("pollRequestUntilTerminalState failed ".concat(response));
                                }
                                _this.pkpEthAddress = response.pkpEthAddress;
                                _this.pkpPublicKey = response.pkpPublicKey;
                                return response;
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, Promise.resolve()];
                    case 4:
                        error_1 = _a.sent();
                        return [2 /*return*/, Promise.reject("registerPasskey failed: ".concat(error_1))];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    LitAuth.prototype.authenticatePasskey = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = this;
                        return [4 /*yield*/, this.webAuthnProvider.authenticate()];
                    case 1:
                        _a.authenticated = _b.sent();
                        return [2 /*return*/, Promise.resolve()];
                    case 2:
                        error_2 = _b.sent();
                        return [2 /*return*/, Promise.reject("Authentication failed ".concat(error_2))];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    LitAuth.prototype.fetchPkpsForAuthMethod = function () {
        return __awaiter(this, void 0, void 0, function () {
            var pkps, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(this.authenticated === undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.authenticatePasskey()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (this.authenticated === undefined) {
                            return [2 /*return*/, Promise.reject("No auth method found")];
                        }
                        return [4 /*yield*/, this.webAuthnProvider.fetchPKPsThroughRelayer(this.authenticated)];
                    case 3:
                        pkps = _a.sent();
                        if (pkps.length === 0) {
                            return [2 /*return*/, Promise.reject("No PKPs found")];
                        }
                        return [2 /*return*/, pkps];
                    case 4:
                        error_3 = _a.sent();
                        return [2 /*return*/, Promise.reject("Retrieving PKPs failed ".concat(error_3))];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    LitAuth.prototype.getSessionSigs = function () {
        return __awaiter(this, void 0, void 0, function () {
            var authNeededCallback, sessionSigs, error_4;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        if (!(this.authenticated === undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.authenticatePasskey()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (this.authenticated === undefined) {
                            return [2 /*return*/, Promise.reject("No auth method found")];
                        }
                        if (!(this.pkpPublicKey === undefined)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.fetchPkpsForAuthMethod()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        if (this.pkpPublicKey === undefined) {
                            return [2 /*return*/, Promise.reject("No PKPs found")];
                        }
                        return [4 /*yield*/, this.litNodeClient.connect()];
                    case 5:
                        _a.sent();
                        authNeededCallback = function (params) { return __awaiter(_this, void 0, void 0, function () {
                            var resp;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.litNodeClient.signSessionKey({
                                            statement: params.statement,
                                            authMethods: [this.authenticated],
                                            pkpPublicKey: this.pkpPublicKey,
                                            expiration: params.expiration,
                                            resources: params.resources,
                                            chainId: this.chain.chainId,
                                        })];
                                    case 1:
                                        resp = _a.sent();
                                        return [2 /*return*/, resp.authSig];
                                }
                            });
                        }); };
                        return [4 /*yield*/, this.litNodeClient.getSessionSigs({
                                expiration: constants_2.DEFAULT_EXP,
                                chain: this.chain.name,
                                resourceAbilityRequests: [
                                    {
                                        resource: new auth_helpers_1.LitActionResource("*"),
                                        ability: auth_helpers_1.LitAbility.PKPSigning,
                                    },
                                ],
                                switchChain: false,
                                authNeededCallback: authNeededCallback,
                            })];
                    case 6:
                        sessionSigs = _a.sent();
                        if (sessionSigs === undefined) {
                            return [2 /*return*/, Promise.reject("Retrieving session sigs failed. undefined")];
                        }
                        this.sessionSig = sessionSigs;
                        return [2 /*return*/, true];
                    case 7:
                        error_4 = _a.sent();
                        return [2 /*return*/, Promise.reject("Retrieving session sigs failed ".concat(error_4))];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    LitAuth.prototype.createPkpEthersWallet = function () {
        return __awaiter(this, void 0, void 0, function () {
            var pkpWallet, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.authenticated === undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.authenticatePasskey().catch(function (error) {
                                return Promise.reject("Transaction failed ".concat(error));
                            })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!(this.pkpPublicKey === undefined)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.fetchPkpsForAuthMethod().catch(function (error) {
                                return Promise.reject("Transaction failed ".concat(error));
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!(this.sessionSig === undefined)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.getSessionSigs().catch(function (error) {
                                return Promise.reject("Transaction failed ".concat(error));
                            })];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        _a.trys.push([6, 8, , 9]);
                        pkpWallet = new pkp_ethers_1.PKPEthersWallet({
                            controllerSessionSigs: this.sessionSig,
                            pkpPubKey: this.pkpPublicKey,
                            rpc: "https://chain-rpc.litprotocol.com/http",
                        });
                        return [4 /*yield*/, pkpWallet.init()];
                    case 7:
                        _a.sent();
                        if (pkpWallet === undefined) {
                            return [2 /*return*/, Promise.reject("Transaction failed. pkpWallet undefined")];
                        }
                        this.pkpWallet = pkpWallet;
                        return [2 /*return*/, true];
                    case 8:
                        error_5 = _a.sent();
                        return [2 /*return*/, Promise.reject("Transaction failed ".concat(error_5))];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    LitAuth.prototype.getSimpleAccountOwner = function () {
        return __awaiter(this, void 0, void 0, function () {
            var owner, error_6;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.simpleAccountOwner) {
                            return [2 /*return*/, this.simpleAccountOwner];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        if (!(this.pkpWallet === undefined)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.createPkpEthersWallet().catch(function (error) {
                                return Promise.reject("Transaction failed ".concat(error));
                            })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        owner = {
                            signMessage: function (msg) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.pkpWallet.signMessage(msg)];
                                        case 1: return [2 /*return*/, (_a.sent())];
                                    }
                                });
                            }); },
                            getAddress: function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.pkpWallet.getAddress()];
                                        case 1: return [2 /*return*/, (_a.sent())];
                                    }
                                });
                            }); },
                            signTypedData: function (params) { return __awaiter(_this, void 0, void 0, function () {
                                var types;
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            types = (_a = {},
                                                _a[params.primaryType] = params.types["x"].map(function (value) {
                                                    return ({
                                                        name: value.name,
                                                        type: value.type,
                                                    });
                                                }),
                                                _a);
                                            return [4 /*yield*/, this.pkpWallet._signTypedData(params.domain ? params.domain : {}, types, params.message)];
                                        case 1: return [2 /*return*/, (_b.sent())];
                                    }
                                });
                            }); },
                        };
                        this.simpleAccountOwner = owner;
                        return [2 /*return*/, owner];
                    case 4:
                        error_6 = _a.sent();
                        return [2 /*return*/, Promise.reject("Get Simple Account Owner failed ".concat(error_6))];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return LitAuth;
}(passkey_1.default));
exports.default = LitAuth;
