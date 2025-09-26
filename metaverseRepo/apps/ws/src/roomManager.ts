import type { OutgoingMessage } from "./types.js";
import type { User } from "./user.ts";


export class RoomManager{

    rooms: Map<string, User[]> = new Map();
    static instance : RoomManager;
    private constructor(){
        this.rooms = new Map();
    }

    static getInstance(){
        if(!RoomManager.instance){
            RoomManager.instance = new RoomManager();
            return RoomManager.instance
        }
        return RoomManager.instance
    }

    public addUser(spaceId: string, user: User){
        if(!this.rooms.has(spaceId)){
            this.rooms.set(spaceId, [user]);
            return;
        }
        this.rooms.set(spaceId, [...(this.rooms.get(spaceId)??[]), user])
    }

    public broadcast(message: OutgoingMessage, user: User, roomId: string){
        if(!this.rooms.has(roomId)){
            return;
        }
        this.rooms.get(roomId)?.forEach((u)=>{
            if(u.id !== user.id){
                u.send(message)
            }
        })
    }

    public removeUser(user: User,spaceId: string){
        if(!this.rooms.has(spaceId)){
            return;
        }
        this.rooms.set(spaceId, (this.rooms.get(spaceId)?.filter((u)=> u.id !== user.id)??[]))
    }

}