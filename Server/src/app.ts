import express, {Express} from 'express';
import morgan from 'morgan';
import resortsRouter from './routes/resorts.route.js';
import conditionsRouter from './routes/conditions.route.js';

const app: Express = express();

app.use(express.json());
app.use(morgan('tiny'));

app.use('/api/resorts', resortsRouter);
app.use('/api/conditions', conditionsRouter);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

export default app;
