import { Request, Response } from "express";
import prisma from "../prismaClient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/index.js";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Missing credentials" });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: "12h" }
  );
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
};
