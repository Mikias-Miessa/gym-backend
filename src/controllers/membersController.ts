import { Request, Response } from "express";
import prisma from "../prismaClient.js";
import { addMonths } from "date-fns";

export const createMember = async (req: Request, res: Response) => {
  const { fullName, phone, startDate, planId, createdById } = req.body;
  if (!fullName || !phone || !startDate || !planId || !createdById)
    return res.status(400).json({ message: "Missing fields" });
  const plan = await prisma.plan.findUnique({ where: { id: planId } });
  if (!plan) return res.status(404).json({ message: "Plan not found" });

  const start = new Date(startDate);
  const end = addMonths(start, plan.durationInMonths);

  const member = await prisma.member.create({
    data: {
      fullName,
      phone,
      startDate: start,
      endDate: end,
      planId,
      createdById,
    },
  });

  // Create initial payment based on selected plan
  await prisma.payment.create({
    data: {
      memberId: member.id,
      amount: Number(plan.price),
      nextDue: end,
    },
  });

  res.status(201).json(member);
};

export const listMembers = async (req: Request, res: Response) => {
  const members = await prisma.member.findMany({
    include: { plan: true, createdBy: true },
  });
  res.json(members);
};

export const getMember = async (req: Request, res: Response) => {
  const { id } = req.params;
  const member = await prisma.member.findUnique({
    where: { id },
    include: { plan: true, payments: true },
  });
  if (!member) return res.status(404).json({ message: "Not found" });
  res.json(member);
};

export const updateMember = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const member = await prisma.member.update({ where: { id }, data });
  res.json(member);
};

export const deleteMember = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.member.delete({ where: { id } });
  res.status(204).send();
};

export const renewSubscription = async (req: Request, res: Response) => {
  const { id } = req.params; // member id
  const member = await prisma.member.findUnique({
    where: { id },
    include: { plan: true },
  });
  if (!member) return res.status(404).json({ message: "Member not found" });
  if (!member.plan)
    return res.status(400).json({ message: "Member has no plan" });

  const nextEnd = new Date(member.endDate);
  // extend by plan duration
  nextEnd.setMonth(nextEnd.getMonth() + member.plan.durationInMonths);

  const payment = await prisma.payment.create({
    data: {
      memberId: member.id,
      amount: Number(member.plan.price),
      nextDue: nextEnd,
    },
  });

  await prisma.member.update({ where: { id }, data: { endDate: nextEnd } });

  res.json({ payment });
};
