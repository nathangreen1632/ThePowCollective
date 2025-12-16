import type { Request, Response } from 'express';
import { getConditionsForResortSlug } from '../services/conditions.service.js';

export async function getConditions(req: Request, res: Response): Promise<void> {
  const slug = String(req.params.resortSlug || '');
  const snapshot = await getConditionsForResortSlug(slug);

  if (!snapshot) {
    res.status(404).json({ error: 'Resort not found' });
    return;
  }

  res.json({ conditions: snapshot });
}
