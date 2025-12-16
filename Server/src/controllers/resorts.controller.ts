import type { Request, Response } from 'express';
import { getAllResorts, getResortBySlug } from '../services/resorts.service.js';

export function listResorts(req: Request, res: Response): void {
  const stateParam = req.query.state;
  const stateSlug = typeof stateParam === 'string' ? stateParam : undefined;
  const resorts = getAllResorts(stateSlug);
  res.json({ resorts });
}

export function getResort(req: Request, res: Response): void {
  const slug = String(req.params.slug || '');
  const resort = getResortBySlug(slug);

  if (!resort) {
    res.status(404).json({ error: 'Resort not found' });
    return;
  }

  res.json({ resort });
}
