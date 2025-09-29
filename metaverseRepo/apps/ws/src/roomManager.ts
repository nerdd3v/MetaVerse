import { use } from "react";
import { User } from "./user.js"
import type { OutgoingMessage } from "./types.js";

export class RoomManager{
    rooms: Map<string, User[]> = new Map();
    static instance: RoomManager;

    private constructor(){
        this.rooms = new Map();
    }

    static getInstance(){
        if(!this.instance){
            this.instance = new RoomManager()
        }
        return this.instance
    }

    public addUser(spaceId: string, user: User){
        if(!spaceId || !user){
            return;
        }
        if(!this.rooms.has(spaceId)){
            this.rooms.set(spaceId, [user])
            return;
        }
        this.rooms.set(spaceId, [...(this.rooms.get(spaceId)??[]), user])
    }

    public removeUser(spaceId: string, user: User){
        if(!spaceId || !user){
            return;
        }
        const spaceIdValid = this.rooms.get(spaceId);
        if(!spaceIdValid){
            return;
        }

        this.rooms.set(spaceId, (this.rooms.get(spaceId)?.filter((u)=>u.id !== user.id)??[]))
    }

    public broadcast(data: OutgoingMessage, user: User, spaceId: string){
        if(!this.rooms.has(spaceId)){
            return;
        }

        this.rooms.get(spaceId)?.forEach((u)=>{
            if(u.id !== user.id){
                u.send(data)
            }
        })

    }

}