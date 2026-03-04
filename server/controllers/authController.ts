import { Request, Response } from 'express';
import axios from 'axios';
import { prisma } from '../db'; // Ensure you have your Prisma client exported here
import { generatePKCE } from '../utils/pkce';
import { encryptToken } from '../utils/crypto';

// In production, use Redis or express-session to store states/verifiers
// For development, we'll use a simple Map
const pkceStore = new Map<string, string>();

/**
 * STEP 1: Redirect User to X Login
 */
export const loginWithX = async (req: Request, res: Response) => {
    try {
        const { verifier, challenge, state } = generatePKCE();

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
            client_id: process.env.X_CLIENT_ID!,
            redirect_uri: process.env.X_CALLBACK_URL!,
            scope: scopes,
            state: state,
            code_challenge: challenge,
            code_challenge_method: 'S256',
        });

        res.redirect(`https://twitter.com/i/oauth2/authorize?${queryParams.toString()}`);
    } catch (error) {
        console.error('Login Redirect Error:', error);
        res.status(500).json({ error: 'Failed to initiate X login' });
    }
};

/**
 * STEP 2: Handle X Callback & Token Exchange
 */
export const xCallback = async (req: Request, res: Response) => {
    const { code, state } = req.query;
    const codeVerifier = pkceStore.get(state as string);

    if (!code || !codeVerifier) {
        return res.status(400).json({ error: 'Invalid state or code verifier expired.' });
    }

    // Clean up store
    pkceStore.delete(state as string);

    try {
        // 1. Exchange Code for Access Token
        const tokenResponse = await axios.post(
            'https://api.twitter.com/2/oauth2/token',
            new URLSearchParams({
                code: code as string,
                grant_type: 'authorization_code',
                client_id: process.env.X_CLIENT_ID!,
                redirect_uri: process.env.X_CALLBACK_URL!,
                code_verifier: codeVerifier,
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${Buffer.from(
                        `${process.env.X_CLIENT_ID}:${process.env.X_CLIENT_SECRET}`
                    ).toString('base64')}`,
                },
            }
        );

        const { access_token, refresh_token, expires_in } = tokenResponse.data;

        // 2. Fetch User Profile Info from X
        const userResponse = await axios.get('https://api.twitter.com/2/users/me', {
            headers: { Authorization: `Bearer ${access_token}` },
            params: { "user.fields": "profile_image_url,username,name" }
        });

        const xUser = userResponse.data.data;

        // 3. Encrypt Tokens for DB Storage
        const encryptedAccess = encryptToken(access_token);
        const encryptedRefresh = encryptToken(refresh_token);
        const expiryDate = new Date(Date.now() + expires_in * 1000);

        // 4. Save/Update User in PostgreSQL
        const user = await prisma.user.upsert({
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

    } catch (error: any) {
        console.error('Auth Error Detail:', error.response?.data || error.message);
        res.status(500).send('Authentication failed during token exchange.');
    }
};