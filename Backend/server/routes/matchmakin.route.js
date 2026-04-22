import express from 'express';
import { matchUser } from '../controllers/matchMaking.controller.js';

const router = express.Router();

router.post("/match", matchUser);

export default router;