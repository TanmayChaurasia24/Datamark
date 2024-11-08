import { PrismaClient } from "@prisma/client";
import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authmiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"] ?? "";
  
  try {
    
    const decodedToken = jwt.verify(authHeader, process.env.JWT_SECRET!) as { userId: string };
    
    if (decodedToken.userId) {
      req.userId = decodedToken.userId; 
      return next();
    } else {
      return res.status(403).json({ message: "You are not logged in" });
    }
  } catch (error: any) {
    console.error("Token verification error:", error);
    return res.status(403).json({ error: "Invalid token" });
  }
};
