import { Router } from 'express';
import { syncData } from '../controllers/syncController';

const router = Router();

router.post('/', syncData);

export default router;
