import { Router } from 'express';
import { listResorts, getResort } from '../controllers/resorts.controller.js';

const router: Router = Router();

router.get('/', listResorts);
router.get('/:slug', getResort);

export default router;
