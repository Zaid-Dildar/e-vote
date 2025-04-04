import { Request, Response, NextFunction } from "express";
import Joi from "joi";

// Define the schema for a candidate
const candidateSchema = Joi.object({
  _id: Joi.string().min(3).max(50).optional(),
  name: Joi.string().min(3).max(50).required().messages({
    "string.base": "Name must be a string",
    "string.min": "Name must be at least 3 characters",
    "string.max": "Name must be less than 50 characters",
    "any.required": "Name is required",
  }),
  picture: Joi.string().uri().required().messages({
    "string.uri": "Picture must be a valid URL",
    "any.required": "Picture is required",
  }),
});

// Define the schema for an audit log
const auditLogSchema = Joi.object({
  action: Joi.string().required().messages({
    "any.required": "Action is required",
  }),
  user: Joi.string().required().messages({
    "any.required": "User ID is required",
  }),
  timestamp: Joi.date().default(Date.now).messages({
    "date.base": "Timestamp must be a valid date",
  }),
});

// Define the schema for an election
const electionSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    "string.base": "Name must be a string",
    "string.min": "Name must be at least 3 characters",
    "string.max": "Name must be less than 100 characters",
    "any.required": "Name is required",
  }),

  department: Joi.string().required().messages({
    "any.required": "Department is required",
  }),

  position: Joi.string().required().messages({
    "any.required": "Position is required",
  }),

  startTime: Joi.date().required().messages({
    "date.base": "Start time must be a valid date",
    "any.required": "Start time is required",
  }),

  endTime: Joi.date().required().greater(Joi.ref("startTime")).messages({
    "date.base": "End time must be a valid date",
    "any.required": "End time is required",
    "date.greater": "End time must be after start time",
  }),

  candidates: Joi.array().items(candidateSchema).min(1).required().messages({
    "array.base": "Candidates must be an array",
    "array.min": "At least one candidate is required",
    "any.required": "Candidates are required",
  }),

  auditLogs: Joi.array().items(auditLogSchema).optional().messages({
    "array.base": "Audit logs must be an array",
  }),
});

export const validateElection = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { error } = electionSchema.validate(req.body, { abortEarly: false });

  if (error) {
    res.status(400).json({
      message: "Validation error",
      errors: error.details.map((err) => err.message),
    });
    return;
  }

  next(); // Proceed if validation passes
};
