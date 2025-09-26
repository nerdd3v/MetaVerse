import { PrismaClient } from "./generated/prisma/client.js";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const client =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;
