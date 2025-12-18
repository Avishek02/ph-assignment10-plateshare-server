import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './db.js';
import foodsRouter from './routes/foods.routes.js';
import requestsRouter from './routes/requests.routes.js';

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));



app.use(express.json());

app.get('/', (_, res) => res.json({ ok: true }));
app.use('/foods', foodsRouter);
app.use('/requests', requestsRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 4000;

export default app;

if (!process.env.VERCEL) {
  (async () => {
    await connectDB(process.env.MONGODB_URI);
    app.listen(PORT, () => console.log(`API on :${PORT}`));
  })();
}
