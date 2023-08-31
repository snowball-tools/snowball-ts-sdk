"use strict";
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
var chains_1 = require("../helpers/chains");
var aa_core_1 = require("@alchemy/aa-core");
var aa_alchemy_1 = require("@alchemy/aa-alchemy");
var promise_1 = require("../helpers/promise");
var alchemy_sdk_1 = require("alchemy-sdk");
var AlchemyAA = /** @class */ (function () {
    function AlchemyAA(auth, apiKey) {
        this.auth = auth;
        this.apiKey = apiKey;
        this.alchemy = new alchemy_sdk_1.Alchemy({
            apiKey: apiKey,
            network: (0, chains_1.getAlchemyNetwork)(this.auth.chain),
        });
    }
    AlchemyAA.prototype.getSmartWalletAddress = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, owner_1, address, error_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        _a = this;
                        return [4 /*yield*/, this.auth.getSimpleAccountOwner(this.auth.chain)];
                    case 1:
                        _a.simpleAccountOwner = _b.sent();
                        owner_1 = this.simpleAccountOwner;
                        if (owner_1 === undefined) {
                            return [2 /*return*/, Promise.reject("SimpleAccountOwner is undefined")];
                        }
                        this.provider = new aa_alchemy_1.AlchemyProvider({
                            chain: (0, chains_1.viemChain)(this.auth.chain),
                            entryPointAddress: this.auth.chain.entryPointAddress,
                            apiKey: this.apiKey,
                        }).connect(function (rpcClient) {
                            return new aa_core_1.SimpleSmartContractAccount({
                                owner: owner_1,
                                entryPointAddress: _this.auth.chain.entryPointAddress,
                                chain: (0, chains_1.viemChain)(_this.auth.chain),
                                factoryAddress: _this.auth.chain.factoryAddress,
                                rpcClient: rpcClient,
                            });
                        });
                        return [4 /*yield*/, this.provider.getAddress()];
                    case 2:
                        address = _b.sent();
                        if (address === undefined) {
                            return [2 /*return*/, Promise.reject("Getting Counterfactual Address failed")];
                        }
                        this.address = address;
                        return [2 /*return*/, address];
                    case 3:
                        error_1 = _b.sent();
                        return [2 /*return*/, Promise.reject("Getting Counterfactual Address failed")];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AlchemyAA.prototype.sendUserOperation = function (gasPolicyId, targetAddress, data) {
        return __awaiter(this, void 0, void 0, function () {
            var result, receipt, userOpReceipt, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        if (!(this.provider === undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getSmartWalletAddress().catch(function (error) {
                                return Promise.reject(error);
                            })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        this.provider = this.provider.withAlchemyGasManager({
                            policyId: gasPolicyId,
                            entryPoint: this.auth.chain.entryPointAddress,
                        });
                        return [4 /*yield*/, this.provider.sendUserOperation({
                                target: targetAddress,
                                data: data,
                            })];
                    case 3:
                        result = _a.sent();
                        if (result === undefined || result.hash === undefined) {
                            return [2 /*return*/, Promise.reject("Transaction failed")];
                        }
                        return [4 /*yield*/, (0, promise_1.retry)(this.provider.waitForUserOperationTransaction, [result.hash], 10)];
                    case 4:
                        receipt = _a.sent();
                        return [4 /*yield*/, (0, promise_1.retry)(this.provider.getUserOperationReceipt, [result.hash], 10)];
                    case 5:
                        userOpReceipt = _a.sent();
                        if (userOpReceipt === null) {
                            return [2 /*return*/, Promise.reject("Transaction failed")];
                        }
                        return [2 /*return*/, true];
                    case 6:
                        error_2 = _a.sent();
                        return [2 /*return*/, Promise.reject("Transaction failed ".concat(error_2))];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return AlchemyAA;
}());
exports.default = AlchemyAA;
