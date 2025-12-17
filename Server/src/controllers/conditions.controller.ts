import type { Request, Response, NextFunction } from 'express';
import { getConditionsForResort } from '../services/conditions.service.js';

export async function getConditions(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const slugParam = req.params.resortSlug;
  const slug = slugParam.trim().toLowerCase();

  if (!slug) {
    res.status(400).json({ error: 'Missing resort slug' });
    return;
  }

  try {
    const snapshot = await getConditionsForResort(slug);
    res.json({ conditions: snapshot });
  } catch (err) {
    if (err instanceof Error && err.message.includes('Resort not found')) {
      res.status(404).json({ error: 'Resort not found' });
      return;
    }

    next(err);
  }
}
