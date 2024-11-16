import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { createTaskInput } from "@datamark-zod/types";

const prismaClient = new PrismaClient();

// User Signup - Registers a user with a hardcoded wallet address
export const usersignup = async (req: Request, res: Response): Promise<any> => {
  try {
    // Hardcoded wallet address for demonstration
    const hardcodewalletaddress: string = "0x9750E5Ce7f0128290C1CaA0E72A8525581f36A7D";

    // Check if the user with the given wallet address already exists in the database
    const existing_user = await prismaClient.user.findFirst({
      where: {
        address: hardcodewalletaddress,
      },
    });

    // If user exists, generate a JWT token and return it
    if (existing_user) {
      const token = jwt.sign(
        { userId: existing_user.id },          // Payload contains user ID
        process.env.JWT_SECRET!                // Secret key from environment variable
      );

      // Send the JWT token to the client
      return res.status(200).json({ token });
    } else {
      // If user does not exist, create a new user with the hardcoded wallet address
      const user = await prismaClient.user.create({
        data: {
          address: hardcodewalletaddress,
        },
      });
      // Respond with success message and created user details
      return res.status(201).json({
        message: "User created successfully",
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

// Creating a Task - Allows a user to create a task with options
export const task = async (req: Request, res: Response): Promise<any> => {
  // @ts-ignore 
  const userId = req.userId;

  try {
    const body = req.body;

    // Validate the request body using Zod schema
    const isCorrectInput = createTaskInput.safeParse(body);

    // If validation fails, return an error response
    if (!isCorrectInput.success) {
      return res.status(411).json({
        message: "you have sent the wrong input's",
      });
    }

    // Create a task and its related options within a database transaction
    let response = await prismaClient.$transaction(async (tx) => {
      // Create the task with a title, amount, signature, and user_id
      const taskreponse = await tx.task.create({
        data: {
          title: isCorrectInput.data?.title ?? "choose one from the give options", // Default title if not provided
          amount: "50",                   // Hardcoded amount for demonstration
          signature: isCorrectInput.data?.signature!, // User-provided signature
          user_id: userId,                // Associate task with logged-in user
        },
      });

      // Create multiple options for the task using the data provided
      await tx.option.createMany({
        data: isCorrectInput.data.options.map((x) => ({
          image_url: x.imageUrl,          // Image URL for the option
          task_id: taskreponse.id,        // Associate option with the created task
        })),
      });
    });

    // Respond with success message and result
    return res.status(201).json({
      message: "Task created successfully",
      result: response,
    });
  } catch (error: any) {
    // Catch and handle any server errors
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Fetching Task Details - Allows a user to view a task and its option counts
export const taskk = async (req: Request, res: Response): Promise<any> => {
  try {
    // Extract task ID from query parameters
    const taskId: any = req.query.taskId;

    // @ts-ignore - Ignore TypeScript error for missing 'userId' in type definition
    const userId: string = req.userId;

    // Fetch task details, including options, if the task belongs to the user
    const taskdetail = await prismaClient.task.findFirst({
      where: {
        user_id: Number(userId),         // Ensure the task belongs to the current user
        id: Number(taskId)               // Match the task by ID
      }, 
      include: { options: true }         // Include the task's options
    });

    // If task not found or user doesn't have access, return an error
    if (!taskdetail) {
      return res.status(411).json({
        message: "you don't have access to this task"
      });
    }

    // Fetch all submissions for the given task
    const response = await prismaClient.submissions.findMany({
      where: {
        task_id: Number(taskId)
      },
      include: {
        option: true                     // Include related option details
      }
    });

    // Initialize a result object to store option counts
    const result: Record<string, {
      count: number,
      option: {
        imageUrl: string
      }
    }> = {};

    // Initialize the count for each option to zero
    taskdetail.options.forEach(option => {
      result[option.id] = {
        count: 0,
        option: {
          imageUrl: option.image_url
        }
      };
    });

    // Count the number of selections for each option
    response.forEach(r => {
      result[r.option_id].count++;
    });

    // Return the result with counts for each option
    return res.json({
      result
    });

  } catch (error: any) {
    // Catch and handle any server errors
    return res.status(500).json({
      error: error.message,
    });
  }
};
