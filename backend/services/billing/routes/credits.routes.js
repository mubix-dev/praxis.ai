import express from 'express';
import { getCredits, checkout, deductCredits } from '../controllers/billing.controller.js';

const router = express.Router();

router.get('/credits', getCredits);
router.post('/checkout', checkout);
router.post('/deduct', deductCredits);


export default router;
