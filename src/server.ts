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



const allowedOrigins = ["https://event-mangement-backend-r5n2.vercel.app/"];
// const allowedOrigins = ["http://localhost:5173", "https://x-one-sable.vercel.app"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


 
app.get('/', (_, res) => {
  res.send('Hello World!'); 
});

app.use('/api/user', userRoutes);
app.use('/api/events', eventRoutes); 
 
const PORT = process.env.PORT
 
app.listen(PORT, () => { 
  console.log(`Server is running on port ${PORT}`)
});         
