import { Request, Response, NextFunction } from "express";
import Joi from "joi";

const biometricKeySchema = Joi.object({
  credentialId: Joi.string().required().messages({
    "any.required": "Credential ID is required",
  }),
  publicKey: Joi.string().required().messages({
    "any.required": "Public key is required",
  }),
  counter: Joi.number().required().messages({
    "any.required": "Counter is required",
  }),
  transports: Joi.array().items(Joi.string()).optional().messages({
    "array.base": "Transports must be an array of strings",
  }),
});

const userSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.base": "Name must be a string",
    "string.min": "Name must be at least 3 characters",
    "string.max": "Name must be less than 50 characters",
    "any.required": "Name is required",
  }),

  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),

  role: Joi.string().valid("admin", "voter", "auditor").required().messages({
    "any.only": "Role must be 'admin', 'voter', or 'auditor'",
    "any.required": "Role is required",
  }),

  department: Joi.string().required().messages({
    "any.required": "Department is required",
  }),

  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),

  biometricRegistered: Joi.boolean().default(false),

  biometricKey: biometricKeySchema
    .allow(null)
    .when("biometricRegistered", {
      is: true,
      then: Joi.optional(),
      otherwise: Joi.forbidden(),
    })
    .messages({
      "object.base": "Biometric key must be an object",
      "any.required":
        "Biometric key is required when biometricRegistered is true",
    }),

  biometricChallenge: Joi.string().allow(null).optional().messages({
    "string.base": "Biometric challenge must be a string",
  }),
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
