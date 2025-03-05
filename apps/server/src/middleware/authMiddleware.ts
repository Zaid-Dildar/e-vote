import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";

interface AuthRequest extends Request {
  user?: any;
}

const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
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

      next(); // Allow access to protected route
    } catch (error) {
      res.status(401).json({ message: "Not authorized, invalid token" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

export default protect;
