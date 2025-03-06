import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";

interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

      // Attach user info to request (without password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        res.status(401).json({ message: "User not found" });
        return;
      }

      next(); // Allow access to protected route
    } catch (error) {
      console.error("Token verification failed:", error);
      res.status(401).json({ message: "Not authorized, invalid token" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Middleware for Role-Based Access Control (RBAC)
export const authorizeRoles =
  (...roles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized, user not found" });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    next(); // Allow access to route
  };
