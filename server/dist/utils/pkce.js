"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePKCE = void 0;
const crypto_1 = __importDefault(require("crypto"));
const generatePKCE = () => {
    // 1. Create a random string (Code Verifier)
    const verifier = crypto_1.default.randomBytes(32).toString('base64url');
    // 2. Hash it with SHA-256 (Code Challenge)
    const challenge = crypto_1.default
        .createHash('sha256')
        .update(verifier)
        .digest('base64url');
    // 3. State (to prevent CSRF attacks)
    const state = crypto_1.default.randomBytes(16).toString('hex');
    return { verifier, challenge, state };
};
exports.generatePKCE = generatePKCE;
