import { Request, Response } from "express";
import prisma from "../prismaClient.js";

export const listPayments = async (req: Request, res: Response) => {
  const payments = await prisma.payment.findMany({ include: { member: true } });
  res.json(payments);
};

export const createPayment = async (req: Request, res: Response) => {
  const { memberId, amount, nextDue } = req.body;
  if (!memberId || !amount)
    return res.status(400).json({ message: "Missing fields" });
  const payment = await prisma.payment.create({
    data: {
      memberId,
      amount: Number(amount),
      nextDue: nextDue ? new Date(nextDue) : undefined,
    },
  });
  res.status(201).json(payment);
};
