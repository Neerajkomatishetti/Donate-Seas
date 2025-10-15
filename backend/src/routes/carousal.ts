import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { PrismaClient } from "../generated/prisma/edge";

export const carousalRouter = new Hono<{
  Bindings: {
    ACC_DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
    username: string;
  };
}>();

carousalRouter.get("/", async (c) => {
  const Client = new PrismaClient({
    datasourceUrl: c.env.ACC_DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const topDonations = await Client.donation.findMany({
      take: 5,
    });

    return c.json({
      message: "success",
      topDonations: topDonations,
    });
  } catch (e) {
    return c.json({
      error: e,
    });
  }
});
