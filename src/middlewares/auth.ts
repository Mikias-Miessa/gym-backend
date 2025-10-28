import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/index.js";

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  if (!header)
    return res.status(401).json({ message: "Missing Authorization header" });
  const token = header.split(" ")[1];
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const authorizeAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  if (req.user.role !== "ADMIN")
    return res.status(403).json({ message: "Forbidden" });
  next();
};
