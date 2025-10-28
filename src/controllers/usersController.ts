import { Request, Response } from "express";
import prisma from "../prismaClient.js";
import bcrypt from "bcrypt";

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "Missing fields" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashed, role: role || "RECEPTIONIST" },
    select: { id: true, name: true, email: true, role: true, active: true },
  });
  res.status(201).json(user);
};

export const listUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      createdAt: true,
    },
  });
  res.json(users);
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, role, active } = req.body;
  const user = await prisma.user.update({
    where: { id },
    data: { name, role, active },
  });
  res.json(user);
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.user.delete({ where: { id } });
  res.status(204).send();
};
