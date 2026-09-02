import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import routes from './routes';

const app: Express = express();

app.use(cors());
app.use(express.json());

// Healthcheck
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'TrackIT API', timestamp: new Date().toISOString() });
});

// Rutas de la API
app.use('/api', routes);

// Middleware global de errores
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[TrackIT Error]:', err.message);
  res.status(500).json({
    success: false,
    error: err.message || 'Error interno del servidor'
  });
});

export default app;
