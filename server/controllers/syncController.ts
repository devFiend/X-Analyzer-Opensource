import { Request, Response } from 'express';
import axios from 'axios';
import { prisma } from '../db';
import { decryptToken } from '../utils/crypto';

export const syncData = async (req: Request, res: Response) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'Username is required.' });
    }

    try {
        // 1. Get user from DB
        const user = await prisma.user.findFirst({
            where: { username }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found in database.' });
        }

        // 2. Decrypt token
        const accessToken = decryptToken(user.encryptedAccessToken);

        // 3. Fetch Following (People you follow)
        // Max results per page for X API is usually 100 or 1000 depending on tier
        const followingResponse = await axios.get(`https://api.twitter.com/2/users/${user.xUserId}/following`, {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { "user.fields": "username,name", "max_results": 1000 }
        });

        // 4. Fetch Followers (People who follow you)
        const followersResponse = await axios.get(`https://api.twitter.com/2/users/${user.xUserId}/followers`, {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { "user.fields": "username,name", "max_results": 1000 }
        });

        const following = followingResponse.data.data || [];
        const followers = followersResponse.data.data || [];

        // 5. Calculate Non-Mutuals (Following who don't follow back)
        const followerIds = new Set(followers.map((f: any) => f.id));
        const nonMutuals = following.filter((f: any) => !followerIds.has(f.id));

        // 6. Return response
        res.json({
            totalFollowing: following.length,
            totalFollowers: followers.length,
            nonMutualCount: nonMutuals.length,
            nonMutuals: nonMutuals.map((n: any) => ({
                id: n.id,
                name: n.name,
                username: n.username
            }))
        });

    } catch (error: any) {
        console.error('Sync Error:', error.response?.data || error.message);

        if (error.response?.status === 429) {
            return res.status(429).json({ error: 'X API rate limit exceeded. Please try again later.' });
        }

        res.status(500).json({ error: 'Failed to sync data from X. Check your developer portal permissions.' });
    }
};
