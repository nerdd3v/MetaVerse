import express from 'express';
import cors from 'cors';
import { v1 } from './Routes/index.js';
// import {client} from '@repo/db';


const app = express();

app.use(cors({
    origin: "http://localhost:5173",   // frontend URL
    credentials: true                  // if you use cookies/auth
  }));

app.use(express.json());
app.use('/api/v1', v1);


app.listen(3000, ()=>{
    console.log('listening on port 3000')
})