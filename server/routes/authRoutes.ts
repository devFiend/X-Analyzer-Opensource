import express from 'express';
import { loginWithX, xCallback } from '../controllers/authController';

const router = express.Router();

router.get('/x', loginWithX);
router.get('/callback', xCallback);

export default router;