import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const authMW = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Missing authorization header" });
    }
    
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }

    const decoded = jwt.verify(token, "cottonCandy") as { userId: string; role: string };
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    //@ts-ignore
    req.user = decoded.userId; // attach to req object
    //@ts-ignore 
    req.role = decoded.role
    next(); // call next middleware/route handler
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
