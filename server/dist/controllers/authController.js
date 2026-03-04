"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.xCallback = exports.loginWithX = void 0;
const axios_1 = __importDefault(require("axios"));
const db_1 = require("../db"); // Ensure you have your Prisma client exported here
const pkce_1 = require("../utils/pkce");
const crypto_1 = require("../utils/crypto");
// In production, use Redis or express-session to store states/verifiers
// For development, we'll use a simple Map
const pkceStore = new Map();
/**
 * STEP 1: Redirect User to X Login
 */
const loginWithX = async (req, res) => {
    try {
        const { verifier, challenge, state } = (0, pkce_1.generatePKCE)();
        // Store verifier mapped to state for 5 minutes
        pkceStore.set(state, verifier);
        setTimeout(() => pkceStore.delete(state), 5 * 60 * 1000);
        const scopes = [
            'tweet.read',
            'users.read',
            'follows.read',
            'follows.write',
            'offline.access'
        ].join(' ');
        const queryParams = new URLSearchParams({
            response_type: 'code',
            client_id: process.env.X_CLIENT_ID,
            redirect_uri: process.env.X_CALLBACK_URL,
            scope: scopes,
            state: state,
            code_challenge: challenge,
            code_challenge_method: 'S256',
        });
        res.redirect(`https://twitter.com/i/oauth2/authorize?${queryParams.toString()}`);
    }
    catch (error) {
        console.error('Login Redirect Error:', error);
        res.status(500).json({ error: 'Failed to initiate X login' });
    }
};
exports.loginWithX = loginWithX;
/**
 * STEP 2: Handle X Callback & Token Exchange
 */
const xCallback = async (req, res) => {
    const { code, state } = req.query;
    const codeVerifier = pkceStore.get(state);
    if (!code || !codeVerifier) {
        return res.status(400).json({ error: 'Invalid state or code verifier expired.' });
    }
    // Clean up store
    pkceStore.delete(state);
    try {
        // 1. Exchange Code for Access Token
        const tokenResponse = await axios_1.default.post('https://api.twitter.com/2/oauth2/token', new URLSearchParams({
            code: code,
            grant_type: 'authorization_code',
            client_id: process.env.X_CLIENT_ID,
            redirect_uri: process.env.X_CALLBACK_URL,
            code_verifier: codeVerifier,
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${Buffer.from(`${process.env.X_CLIENT_ID}:${process.env.X_CLIENT_SECRET}`).toString('base64')}`,
            },
        });
        const { access_token, refresh_token, expires_in } = tokenResponse.data;
        // 2. Fetch User Profile Info from X
        const userResponse = await axios_1.default.get('https://api.twitter.com/2/users/me', {
            headers: { Authorization: `Bearer ${access_token}` },
            params: { "user.fields": "profile_image_url,username,name" }
        });
        const xUser = userResponse.data.data;
        // 3. Encrypt Tokens for DB Storage
        const encryptedAccess = (0, crypto_1.encryptToken)(access_token);
        const encryptedRefresh = (0, crypto_1.encryptToken)(refresh_token);
        const expiryDate = new Date(Date.now() + expires_in * 1000);
        // 4. Save/Update User in PostgreSQL
        const user = await db_1.prisma.user.upsert({
            where: { xUserId: xUser.id },
            update: {
                username: xUser.username,
                name: xUser.name,
                profileImage: xUser.profile_image_url,
                encryptedAccessToken: encryptedAccess,
                encryptedRefreshToken: encryptedRefresh,
                tokenExpiry: expiryDate,
            },
            create: {
                xUserId: xUser.id,
                username: xUser.username,
                name: xUser.name,
                profileImage: xUser.profile_image_url,
                encryptedAccessToken: encryptedAccess,
                encryptedRefreshToken: encryptedRefresh,
                tokenExpiry: expiryDate,
            },
        });
        // 5. Success! Redirect to Frontend (assuming it's on port 3000)
        // In a real app, you'd set a JWT cookie here.
        res.redirect(`http://127.0.0.1:3000/dashboard?user=${user.username}`);
    }
    catch (error) {
        console.error('Auth Error Detail:', error.response?.data || error.message);
        res.status(500).send('Authentication failed during token exchange.');
    }
};
exports.xCallback = xCallback;
