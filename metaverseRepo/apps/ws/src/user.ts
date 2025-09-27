import { WebSocket } from "ws";
import jwt, { type JwtPayload } from 'jsonwebtoken'

import { client } from "@repo/db";
import { RoomManager } from "./roomManager.js";
import type { outgoinMassage } from "./types.js";

function getRandomString(length: number) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}


export class User{
  private ws: WebSocket;
  private x: number;
  private y: number;
  public spaceId?: string;
  public id: string;
  public userId?: string;

  constructor(ws: WebSocket){
    this.ws = ws;
    this.x = 0;
    this.y = 0;
    this.id = getRandomString(10);
    this.initHandler()
  }

  send(payload: outgoinMassage){
    this.ws.send(JSON.stringify(payload))
  }

  initHandler(){
    this.ws.on('message', async(data)=>{
      console.log(data);
      const parsedData = JSON.parse(data.toString());
      console.log(parsedData);

      switch(parsedData.type){
        case 'join':
          console.log('join received')
          const payload = parsedData.payload;
          const spaceId = payload.spaceId;
          const token = payload.token;

          const userId = (jwt.verify(token, "cottonCandy") as JwtPayload).userId

          if(!userId){
            this.ws.close();
            return;
          }

          this.userId = userId

          const space = await client.space.findFirst({
            where:{
              id: spaceId
            },select:{
              width: true,
              height: true
            }
          })

          if(!space){
            this.ws.close();
            return;
          }

          console.log("space received");

          this.spaceId = spaceId

          RoomManager.getInstance().addUser(this.spaceId!, this);

          this.x = Math.floor(Math.random() * space?.width)
          this.y = Math.floor(Math.random() * space?.height)

          this.send({
            type: "space-joined",
            payload:{
              spawn:{
                x: this.x,
                y: this.y,
                userId: this.userId
              },
              users: RoomManager.getInstance().rooms.get(spaceId)
                ?.filter(u => u.id !== this.id)
                ?.map(u => ({
                  userId: u.userId,
                  x: u.x,
                  y: u.y
                })) ?? []
                    }
                  })

          console.log('space joined');

          RoomManager.getInstance().broadcast({
            type: "user-joined",
            payload:{
              userId: this.userId,
              x: this.x,
              y: this.y
            }
          },this, this.spaceId!);
          break;
      
        case 'move':
          console.log('move received');
          const moveX = parsedData.payload.x;
          const moveY = parsedData.payload.y;
          console.log(moveX)
          console.log(moveY)
          const xDisplacement = Math.abs(moveX - this.x);
          const yDisplacement = Math.abs(moveY - this.y);

          if((xDisplacement == 0 && yDisplacement == 1) || (xDisplacement == 1 && yDisplacement == 0)){
            this.x = moveX;
            this.y = moveY

            RoomManager.getInstance().broadcast({
              type: "movement",
              payload:{
                x: this.x,
                y: this.y,
                userId : this.userId
              }
            }, this,this.spaceId!)
            console.log("moved")
            return;
          }
          this.send({
            type: 'movement-rejected',
            payload:{
              x:this.x,
              y:this.y
            }
          })
          break;
        
        case "chat":
          const chatMessage = parsedData.payload.chat;

          if(!chatMessage){
            return;
          }

          RoomManager.getInstance().broadcast({
            type: "chat-send",
            payload:{
              chat: chatMessage,
              userId: this.userId
            }
          },this, this.spaceId!)

          this.send({
            type: "chat",
            payload:{
              chat: chatMessage,
              userId: this.userId
            }
          })
          break;

        case 'proximity-chat':
          console.log("k")
          const chat = parsedData.payload.chat;

          const room = RoomManager.getInstance().rooms.get(this.spaceId!);
          if(!room)return;

          room.forEach((u)=>{
            if(u.id !== this.id){
              const dx = Math.abs(u.x - this.x);
              const dy = Math.abs(u.y - this.y);
              const distance = Math.sqrt(dx*dx + dy*dy);

              if(distance <= 5){
                u.send({
                  type: 'chat-send',
                  payload:{
                    message: chat,
                    userId : this.id
                  }
                })
              }
            }
          })
          this.send({
            type: "chat",
            payload:{
              message: chat,
              userId: this.id
            }
          })
          break;
      }
    })
  }
  destroy(){
    RoomManager.getInstance().broadcast({
      type: "user-left",
      payload:{
        userId: this.userId
      }
    }, this,this.spaceId!)

    RoomManager.getInstance().removeUser(this.spaceId!, this)
  }
}
