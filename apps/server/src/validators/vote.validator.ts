import { Request, Response, NextFunction } from "express";
import Joi from "joi";

// Define the schema for a vote
const voteSchema = Joi.object({
  election: Joi.string().required().messages({
    "any.required": "Election ID is required",
  }),

  user: Joi.string().required().messages({
    "any.required": "User ID is required",
  }),

  candidate: Joi.string().required().messages({
    "any.required": "Candidate ID is required",
  }),

  timestamp: Joi.date().default(Date.now).messages({
    "date.base": "Timestamp must be a valid date",
  }),
});

export const validateVote = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { error } = voteSchema.validate(req.body, { abortEarly: false });

  if (error) {
    res.status(400).json({
      message: "Validation error",
      errors: error.details.map((err) => err.message),
    });
    return;
  }

  next(); // Proceed if validation passes
};
