import express  from "express";
import http from 'http';
import mongoose from "mongoose";

const app = express();
app.use(express.json());

const server = http.createServer(app);

mongoose.connect('url').then(()=>{
    server.listen(3000, ()=>{
        console.log('listening on port 3000')
    })
})