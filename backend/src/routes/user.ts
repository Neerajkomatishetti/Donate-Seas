import { Hono } from "hono";
import { PrismaClient } from "../generated/prisma/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import { signinInput, signupInput } from "../zod";

export const userRouter = new Hono<{
  Bindings: {
    ACC_DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

userRouter.post("/Signup", async (c) => {
  const Client = new PrismaClient({
    datasourceUrl: c.env.ACC_DATABASE_URL,
  }).$extends(withAccelerate());

  console.log(c.env.ACC_DATABASE_URL);

  const body = await c.req.json();

  const Zodresult = signupInput.safeParse(body);

  if (Zodresult.success) {
    try {
      const usr = await Client.user.findFirst({
        where: {
          email: body.email,
        },
      });

      if (usr) {
        return c.json({
          message: "user already exists",
        });
      }

      const user = await Client.user.create({
        data: {
          email: body.email,
          password: body.password,
          name: body.name,
        },
      });

      const token = await sign(
        {
          id: user.id,
          name: user.name,
        },
        c.env.JWT_SECRET
      );
      return c.json(
        {
          token: token,
          isAdmin:user.isAdmin,
        },
        200
      );
    } catch (e) {
      return c.json(
        {
          message: "error while signing up",
          error: e,
        },
        400
      );
    }
  } else {
    return c.json(
      {
        errors: Zodresult.error.issues[0].message,
      },
      400
    );
  }
});

userRouter.post("/Signin", async (c) => {
  const Client = new PrismaClient({
    datasourceUrl: c.env.ACC_DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const Zodresult = signinInput.safeParse(body);

  if (Zodresult.success) {
    try {
      const user = await Client.user.findFirst({
        where: {
          email: body.email,
          password: body.password,
        },
      });

      if (user) {
        const token = await sign(
          {
            id: user.id,
            name: user.name,
          },
          c.env.JWT_SECRET
        );
        c.status(200);
        return c.json({ 
            token: token,
            isAdmin:user.isAdmin
         });
      } else {
        c.status(400);
        return c.json({
          message: "wrong email or password ",
        });
      }
    } catch (e) {
      c.status(411);
      return c.json({
        message: "error while signing up",
        error:e
      });
    }
  } else {
    c.status(400);
    return c.json({
      message: Zodresult.error.issues[0].message,
    });
  }
});
