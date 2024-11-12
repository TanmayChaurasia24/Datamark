import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authmiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const token = req.headers["authorization"] || "";
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    if (decodedToken.userId) {
      req.userId = decodedToken.userId; 
      next();
    } else {
      return res.status(403).json({ message: "Unauthorized: Invalid user ID" });
    }
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(403).json({ message: "Unauthorized: Invalid or expired token" });
  }
};
