import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import userRoutes from './routes/user.routes.js';
import eventRoutes from './routes/event.routes.js';
import cors from 'cors';
import morgan from 'morgan';
const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
connectDB();
 
app.get('/', (_, res) => {
  res.send('Hello World!'); 
});

app.use('/api/user', userRoutes);
app.use('/api/events', eventRoutes); 
 
const PORT = process.env.PORT
 
app.listen(PORT, () => { 
  console.log(`Server is running on port ${PORT}`)
});         