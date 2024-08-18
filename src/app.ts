import dotenv from 'dotenv';

dotenv.config()
import express from 'express';
import authRoutes from './routes/authRoutes'
import usersRoutes from './routes/userRoutes'
import { errorHandler } from './middleware/errorHandler';


const app = express()

app.use(express.json())


//Routes

//Auth
app.use('/auth', authRoutes)

//User
app.use('/users', usersRoutes)



// Middleware de manejo de errores global
app.use(errorHandler);

export default app;