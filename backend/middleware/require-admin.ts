import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export function requireAdmin(request: Request, response: Response, next: NextFunction) {
  const token = request.header("authorization")?.replace("Bearer ", "");
  if (!token || !env.adminJwtSecret)
    return response.status(401).json({ message: "Admin login required." });
  try {
    jwt.verify(token, env.adminJwtSecret);
    next();
  } catch {
    response.status(401).json({ message: "Admin login required." });
  }
}
