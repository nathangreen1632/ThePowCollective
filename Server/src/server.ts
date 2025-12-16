import { createServer } from 'node:http';
import app from './app.js';

const port = Number(process.env.PORT || 3001);

const server = createServer(app);

server.listen(port, () => {
  process.stdout.write(`PowCollective API listening on ${port}\n`);
});
