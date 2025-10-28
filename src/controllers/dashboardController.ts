import { Request, Response } from "express";
import prisma from "../prismaClient.js";
import { startOfMonth, endOfMonth } from "date-fns";

export const getDashboard = async (req: Request, res: Response) => {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const [totalMembers, monthlyAgg, allTimeAgg, newSignups, overdueMembers] =
    await Promise.all([
      prisma.member.count(),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { createdAt: { gte: monthStart, lte: monthEnd } },
      }),
      prisma.payment.aggregate({ _sum: { amount: true } }),
      prisma.member.count({
        where: { startDate: { gte: monthStart, lte: monthEnd } },
      }),
      prisma.member.findMany({
        where: { endDate: { lte: now } },
        include: { plan: true },
      }),
    ]);

  res.json({
    totalMembers,
    monthlyRevenue: monthlyAgg._sum.amount ?? 0,
    allTimeRevenue: allTimeAgg._sum.amount ?? 0,
    newSignups,
    overdueMembers,
  });
};
