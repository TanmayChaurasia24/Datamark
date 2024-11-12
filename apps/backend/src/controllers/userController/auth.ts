import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import {Request, Response } from "express"; 
import {createTaskInput } from "@datamark-zod/types"

const prismaClient = new PrismaClient();

export const usersignup = async (req: Request, res: Response): Promise<any> => {
  try {
    const hardcodewalletaddress: string = "0x9750E5Ce7f0128290C1CaA0E72A8525581f36A7D";

    const existing_user = await prismaClient.user.findFirst({
      where: {
        address: hardcodewalletaddress,
      },
    });

    if (existing_user) {
      const token = jwt.sign(
        { userId: existing_user.id },
        process.env.JWT_SECRET!
      );

      return res.status(200).json({ token });
    } else {
      const user = await prismaClient.user.create({
        data: {
          address: hardcodewalletaddress,
        },
      });
      return res.status(201).json({
        message: "User created successfully",
        success: true,
        createduser: user
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const task = async (req: Request, res: Response): Promise<any> => {
  // @ts-ignore
  const userId = req.userId

  try {
    const body = req.body;  

    const isCorrectInput = createTaskInput.safeParse(body)

    if(!isCorrectInput.success) {
      return res.status(411).json({
        message: "you have sent the wrong input's"
      })
    } 

    let response = await prismaClient.$transaction(async (tx) => {
      const taskreponse = await tx.task.create({
        data: {
          title: isCorrectInput.data?.title ?? "choose one from the give options",
          amount: "50",
          signature: isCorrectInput.data?.signature!,
          user_id: userId
        }
      })

      await tx.option.createMany({
        data: isCorrectInput.data.options.map((x) => ({
          image_url: x.imageUrl,
          task_id: taskreponse.id
        }))
      })
    })

    return res.status(201).json({
      message: "Task createad sucessfully",
      result: response
    })
  } catch (error: any) {
    return res.status(500).json({
      error: error.message
    })
  }
}
