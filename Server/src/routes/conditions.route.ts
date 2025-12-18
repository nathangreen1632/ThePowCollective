import { Router } from 'express';
import { getConditions } from '../controllers/conditions.controller.js';

const router: Router = Router();

router.get('/:resortSlug', getConditions);

export default router;
