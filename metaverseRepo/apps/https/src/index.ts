import express from 'express';
import { userRouter } from './Routes/routeIndex.js';


const app = express();

app.use(express.json());
app.use('/api/v1', userRouter);


app.listen(3000, ()=>{
    console.log('listening on port 3000')
})