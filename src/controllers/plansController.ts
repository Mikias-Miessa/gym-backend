import { Request, Response } from "express";
import prisma from "../prismaClient.js";

export const createPlan = async (req: Request, res: Response) => {
  const { name, durationInMonths, price } = req.body;
  const plan = await prisma.plan.create({
    data: {
      name,
      durationInMonths: Number(durationInMonths),
      price: Number(price),
    },
  });
  res.status(201).json(plan);
};

export const listPlans = async (req: Request, res: Response) => {
  const plans = await prisma.plan.findMany();
  res.json(plans);
};

export const updatePlan = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, durationInMonths, price } = req.body;
  const plan = await prisma.plan.update({
    where: { id },
    data: {
      name,
      durationInMonths: Number(durationInMonths),
      price: Number(price),
    },
  });
  res.json(plan);
};

export const deletePlan = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.plan.delete({ where: { id } });
  res.status(204).send();
};
