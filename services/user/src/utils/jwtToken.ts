import jwt, { JwtPayload } from "jsonwebtoken";
import { Document } from "mongoose";

export const generateToken = (user: string | Document) => {
      return jwt.sign({ user }, process.env.JWT_SECRET!, {
            expiresIn: "30d",})
}

export const verifyToken = (token: string) => {
      return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
}