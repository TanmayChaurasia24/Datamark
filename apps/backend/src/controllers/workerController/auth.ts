import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import z, { any, ParseStatus } from "zod";

const prismaClient = new PrismaClient();



//--------------------------ZOD TYPES---------------------------------------
const submissiontypes = z.object({
  taskId: z.string(),
  selection: z.string(),
});

// worker Signup - Registers a worker with a hardcoded wallet address
export const usersignup = async (req: Request, res: Response): Promise<any> => {
  try {
    // Hardcoded wallet address for demonstration
    const hardcodewalletaddress: string =
      "0x9750E5Ce7f0128290C1CasdsaA0E72A8525581f36A7D";

    // Check if the user with the given wallet address already exists in the database
    const existing_worker = await prismaClient.workers.findFirst({
      where: {
        address: hardcodewalletaddress,
      },
    });

    // If user exists, generate a JWT token and return it
    if (existing_worker) {
      const token = jwt.sign(
        { userId: existing_worker.id }, // Payload contains user ID
        process.env.WORKER_JWT_SECRET! // Secret key from environment variable
      );

      // Send the JWT token to the client
      return res.status(200).json({ token });
    } else {
      // If user does not exist, create a new user with the hardcoded wallet address
      const user = await prismaClient.workers.create({
        data: {
          address: hardcodewalletaddress,
          pending_amount: 0,
          locked_amount: 0,
        },
      });
      // Respond with success message and created user details
      return res.status(201).json({
        message: "Worker created successfully",
        success: true,
        createduser: user,
      });
    }
  } catch (error) {
    // Catch and handle any server errors
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const nextTask = async (req: Request, res: Response): Promise<any> => {
  try {
    //@ts-ignore
    const userId = req.userId;

    const task = await prismaClient.task.findFirst({
      where: {
        done: false,
        submissions: {
          none: {
            worker_id: userId,
          },
        },
      },
      select: {
        id: true,
        title: true,
        options: true,
      },
    });

    if (!task) {
      res.status(411).json({
        message: "no more task left for you to review",
      });
    }

    return res.status(201).json({
      task,
    });
  } catch (error) {
    return res.status(500).json({
      error: "internal server error",
    });
  }
};

export const nextsubmission = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    //@ts-ignore
    const userId = req.userId;
    const body = req.body();
    const parseddata = submissiontypes.safeParse(body);

    if (!parseddata.success) {
      return res.status(400).json({
        message: "enter the valid request body",
      });
    }

    const task = await prismaClient.task.findFirst({
      where: {
        done: false,
        submissions: {
          none: {
            worker_id: userId,
          },
        },
      },
      select: {
        id: true,
        title: true,
        amount: true,
        options: true,
      },
    });

    if (!task) {
      res.status(411).json({
        message: "error while getting task",
      });
    }

    if (task?.id !== Number(parseddata.data.taskId)) {
      return res.status(411).json({
        message: "incorrect task id",
      });
    }
    const amount = (Number(task.amount) / 100).toString();

    const submission = await prismaClient.$transaction(async () => {
      const submission = await prismaClient.submissions.create({
        data: {
          option_id: Number(parseddata.data.selection),
          worker_id: userId,
          task_id: Number(parseddata.data.taskId),
          amount,
        },
      });
      const totalDec = process.env.TOTAL_DEC ? Number(process.env.TOTAL_DEC) : 0;

      await prismaClient.workers.update({
        where: {
          id: userId,
        },
        data: {
          pending_amount: {
            increment: Number(amount) * totalDec
          }
        }
      })

      return res.status(201).json({
        submission
      })
    })

    const nexttask = await prismaClient.task.findFirst({
      where: {
        done: false,
        submissions: {
          none: {
            worker_id: userId,
          },
        },
      },
      select: {
        id: true,
        title: true,
        amount: true,
        options: true,
      },
    });

    if (!nexttask) {
      return res.status(411).json({
        message: "no more tasks available",
      });
    }

    return res.status(201).json({
      nexttask,
      amount,
    });
  } catch (error) {
    return res.status(500).json({
      error: "internal server error",
      message: "while next submission",
    });
  }
};
