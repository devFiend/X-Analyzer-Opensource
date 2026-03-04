import crypto from 'crypto';

export const generatePKCE = () => {
    // 1. Create a random string (Code Verifier)
    const verifier = crypto.randomBytes(32).toString('base64url');

    // 2. Hash it with SHA-256 (Code Challenge)
    const challenge = crypto
        .createHash('sha256')
        .update(verifier)
        .digest('base64url');

    // 3. State (to prevent CSRF attacks)
    const state = crypto.randomBytes(16).toString('hex');

    return { verifier, challenge, state };
};