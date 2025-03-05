import { Request, Response } from "express";
import { authenticateUser } from "../services/authService";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const userData = await authenticateUser(email, password);

    res.status(200).json({
      message: "Login successful",
      user: userData,
    });
  } catch (error) {
    const errMessage =
      error instanceof Error ? error.message : "Something went wrong";
    res.status(401).json({ message: errMessage });
  }
};
