import express from 'express';
import chatroutes from './routes/chatroutes.js';
import connectDb from './config/config.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/', chatroutes);



connectDb().then(()=>{
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})
