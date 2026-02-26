import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { PrismaClient } from "../generated/prisma/edge";
import { verify } from "hono/jwt";

interface userProps {
  id: string;
  name: string;
  userDonations: number;
}

export const meRouter = new Hono<{
  Bindings: {
    ACC_DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
    username: string;
  };
}>();

meRouter.use("/*", async (c, next) => {
  const authHeader = c.req.header("Authorization") || "";
  const token = authHeader;
  try {
    const secret = c.env.JWT_SECRET;
    const user = await verify(token, secret, "HS256");

    if (user) {
      const id = user.id as string;
      const username = user.name as string;
      c.set("userId", id);
      c.set("username", username);
      
      return await next();
    } else {
      return c.json(
        {
          message: "Not Logged In",
        },
        403,
      );
    }
  } catch (e) {
    return c.json(
      {
        message: "Error in Middlewares!",
        error: e,
      },
      403,
    );
  }
});

meRouter.get("/", async (c) => {
  const Client = new PrismaClient({
    accelerateUrl: c.env.ACC_DATABASE_URL,
  }).$extends(withAccelerate());

  const userId = c.get("userId");
  try {
    const user = await Client.user.findUnique({
      where: {
        id: userId,
      },
    });

    const userDetails: userProps = {
      id: user?.id || "",
      name: user?.name || "",
      userDonations: user?.userDonations || 0,
    };

    if (user) {
      c.status(200);
      return c.json({
        user: userDetails,
      });
    } else {
      c.status(400);
      return c.json({
        message: "no user found ",
      });
    }
  } catch (e) {
    c.status(411);
    return c.json({
      error: e,
    });
  }
});
