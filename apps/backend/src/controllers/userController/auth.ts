import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { Application, Request, Response } from "express"; 

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

