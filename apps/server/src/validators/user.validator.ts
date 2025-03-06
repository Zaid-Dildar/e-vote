import { Request, Response, NextFunction } from "express";
import Joi from "joi";

const userSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("admin", "voter", "auditor").required(),
  hasBiometrics: Joi.boolean().required(),
});

export const validateUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { error } = userSchema.validate(req.body, { abortEarly: false });

  if (error) {
    res.status(400).json({
      message: "Validation error",
      errors: error.details.map((err) => err.message),
    });
    return;
  }

  next(); // Proceed if validation passes
};
