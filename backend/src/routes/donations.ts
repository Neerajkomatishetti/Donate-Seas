import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { PrismaClient } from "../generated/prisma/edge";
import { verify } from "hono/jwt";
import { DonationInput } from "../zod";
import { getQueryParams } from "hono/utils/url";

export const donateRouter = new Hono<{
  Bindings: {
    ACC_DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
    username: string;
  };
}>();

donateRouter.use("/*", async (c, next) => {
  const AuthHeader = c.req.header("Authorization") || "";

  try {
    console.log(AuthHeader);
    console.log("hi there hello sorry");
    const secret = c.env.JWT_SECRET
    const user = await verify(AuthHeader, secret);
    console.log(user);
    console.log("hi there 2");
    if (user) {
      const id = user.id as string;
      const username = user.name as string;
      console.log(id);
      c.set("userId", id);
      c.set("username", username);
      return await next();
    } else {
      return c.json(
        {
          message: "Not Logged In",
        },
        403
      );
    }
  } catch (e) {
    return c.json(
      {
        message: "Error in Middlewares!",
        error:e
      },
      403
    );
  }
});

donateRouter.post("/", async (c) => {
  const Client = new PrismaClient({
    datasourceUrl: c.env.ACC_DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const authorId = c.get("userId");

  const Zodresult = DonationInput.safeParse(body);
  console.log("neeee")

  if(Zodresult.success){
    console.log("neeeraj")
    const Donation = await Client.donation.create({
      data: {
        name: body.name,
        amount: body.amount,
        imgurl: body.imgurl,
        Status: body.Status,
        authorId: authorId,
        createdAt: body.createdAt
      },
    });

    return c.json(
      {
        message: "success",
        id: Donation.id,
      },
      200
    );
  } else {
    return c.json(
      {
        message: "invalid inputs",
        error:Zodresult.error.issues
      },
      400
    );
  }
});

donateRouter.get('/mydonations', async (c) => {
  const Client = new PrismaClient({
    datasourceUrl: c.env.ACC_DATABASE_URL,
  }).$extends(withAccelerate());

  const userId = c.get('userId')

  try {
    const donations = await Client.donation.findMany({
      where:{
        authorId:userId
      }
    });

    return c.json({
      message:"success",
      donations:donations
    })
  }catch (e) {
    return c.json(
      {
        error:e
      }
    )
  }

})

donateRouter.get("/bulk", async (c) => {
  const Client = new PrismaClient({
    datasourceUrl: c.env.ACC_DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const donations = await Client.donation.findMany();

    return c.json({
      message:"success",
      donations:donations
    })
  }catch (e) {
    return c.json(
      {
        error:e
      }
    )
  }

})

donateRouter.get("/carousal", async (c) => {
  const Client = new PrismaClient({
    datasourceUrl: c.env.ACC_DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const topDonations = await Client.donation.findMany({
      take: 5,
    });
    

    return c.json({
      message:"success",
      topDonations:topDonations
    })
  }catch (e) {
    return c.json(
      {
        error:e
      }
    )
  }

})

donateRouter.put("/Approve", async (c) => {
  const Client = new PrismaClient({
    datasourceUrl: c.env.ACC_DATABASE_URL,
  }).$extends(withAccelerate());

  try {

    const body = await c.req.json();
    const donation_id = body.data.id
    console.log(donation_id)

    const Admin = await Client.user.findUnique({
      where:{
        id:c.get('userId')
      }
    })

    console.log("hello")
    console.log(Admin);

    if(Admin?.isAdmin){
     await Client.donation.update({
        where: {
          id:donation_id,
        },
        data: {
          Status: true,
        },
      });

      console.log("neer")
  
      return c.json({
        message: "success"
      });
    }else {
      return c.json({
        message:"Not allowed",
      })
    }

  } catch (e) {
    return c.json({
      error: e,
    },403);
  }
});

donateRouter.get("/A", async (c) => {
  const Client = new PrismaClient({
    datasourceUrl: c.env.ACC_DATABASE_URL,
  }).$extends(withAccelerate());

  try {


    const params = getQueryParams
    const body = await c.req.json();
    const donation_id = params.arguments.id

    const Admin = await Client.user.findUnique({
      where:{
        id:c.get('userId')
      }
    })

    if(Admin?.isAdmin){
      const donations = await Client.donation.update({
        where: {
          id:donation_id,
        },
        data: {
          Status: true,
        },
      });
  
      return c.json({
        message: "success",
        donations: donations,
      });
    }else {
      return c.json({
        message:"Not allowed",
      }, 403)
    }

  } catch (e) {
    return c.json({
      error: e,
    });
  }
});

