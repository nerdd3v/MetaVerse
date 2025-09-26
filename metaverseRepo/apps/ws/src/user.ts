import { WebSocket } from "ws";
import { RoomManager } from "./roomManager.js";
import type { OutgoingMessage } from "./types.js";
import { client } from "@repo/db";
import jwt, { type JwtPayload } from "jsonwebtoken";

interface ParseData {
  type: string;
  payload: {
    spaceId: string;
    token: string;
    x?: number;
    y?: number;
  };
}

function generateRandomString(max: number) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < max; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export class User {
  public id: string;
  public userId?: string;
  private spaceId?: string;
  private x?: number;
  private y?: number;
  private ws: WebSocket;

  constructor(ws: WebSocket) {
    this.id = generateRandomString(10);
    this.ws = ws;
    this.x = 0;
    this.y = 0;
    this.initHandlers();
  }

  initHandlers() {
    this.ws.on("message", async (data) => {
      const parsedData: ParseData = JSON.parse(data.toString());

      switch (parsedData.type) {
        case "join": {
          const spaceId = parsedData.payload.spaceId;
          const token = parsedData.payload.token;
          const _jwt = jwt.verify(token, "cottonCandy") as JwtPayload;
          const userId = _jwt.userId;

          if (!userId) {
            this.ws.close();
            return;
          }
          this.userId = userId;

          const space = await client.space.findFirst({
            where: { id: spaceId },
            select: { height: true, width: true }
          });
          if (!space) {
            this.ws.close();
            return;
          }
          this.spaceId = spaceId;

          RoomManager.getInstance().addUser(spaceId, this);

          this.x = Math.floor(Math.random() * space.width);
          this.y = Math.floor(Math.random() * space.height);

          // Inform joining client of spawn + other users in room
          this.send({
            type: "space-joined",
            payload: {
              spawn: { x: this.x, y: this.y, userId: this.userId },
              users: RoomManager.getInstance().rooms.get(spaceId)
                ?.filter((x) => x.id !== this.id)
                .map((u) => ({
                  userId: u.userId,
                  x: u.x,
                  y: u.y
                })) ?? []
            }
          });

          // Inform others of join
          RoomManager.getInstance().broadcast({
            type: "user-joined",
            payload: {
              userId: this.userId,
              x: this.x,
              y: this.y
            }
          }, this, this.spaceId!);
          break;
        }

        case "move": {
          const moveX = parsedData.payload.x!;
          const moveY = parsedData.payload.y!;
          const xDisplacement = Math.abs(this.x! - moveX);
          const yDisplacement = Math.abs(moveY - this.y!);

          if ((xDisplacement == 1 && yDisplacement == 0) || (xDisplacement == 0 && yDisplacement == 1)) {
            this.x = moveX;
            this.y = moveY;
            RoomManager.getInstance().broadcast({
              type: "movement",
              payload: {
                userId: this.userId,
                x: this.x,
                y: this.y
              }
            }, this, this.spaceId!);
          } else {
            this.send({
              type: "movement-rejected",
              payload: {
                x: this.x,
                y: this.y
              }
            });
          }
          break;
        }

        // You can add other message types here...
      }
    });

    this.ws.on("close", () => {
      this.destroy();
    });

    this.ws.on("error", () => {
      this.destroy();
    });
  }

  destroy() {
    if (this.spaceId) {
      RoomManager.getInstance().broadcast({
        type: "user-left",
        payload: {
          userId: this.userId
        }
      }, this, this.spaceId);

      RoomManager.getInstance().removeUser(this, this.spaceId);
    }
  }

  send(payload: OutgoingMessage) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
    }
  }
}
