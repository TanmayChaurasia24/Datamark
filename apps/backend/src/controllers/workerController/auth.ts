import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prismaClient = new PrismaClient();

// worker Signup - Registers a worker with a hardcoded wallet address
export const usersignup = async (req: Request, res: Response): Promise<any> => {
  try {
    // Hardcoded wallet address for demonstration
    const hardcodewalletaddress: string = "0x9750E5Ce7f0128290C1CasdsaA0E72A8525581f36A7D";

    // Check if the user with the given wallet address already exists in the database
    const existing_worker = await prismaClient.workers.findFirst({
      where: {
        address: hardcodewalletaddress,
      },
    });

    // If user exists, generate a JWT token and return it
    if (existing_worker) {
      const token = jwt.sign(
        { userId: existing_worker.id },          // Payload contains user ID
        process.env.WORKER_JWT_SECRET!                // Secret key from environment variable
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