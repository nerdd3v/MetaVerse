import { WebSocketServer } from "ws";
import { User } from "./user.js";

const wss = new WebSocketServer({port: 3001});

wss.on('connection', (ws)=>{

    let user = new User(ws)

    ws.on('error', ()=>{
        console.error
    })

    ws.on('message',()=>{
        user.destroy()
    })
})