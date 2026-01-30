import {Router} from 'express';
import { authCallback } from '../controller/auth.contoller.js';

const router = Router();

router.post('/callback', authCallback);

export default router;