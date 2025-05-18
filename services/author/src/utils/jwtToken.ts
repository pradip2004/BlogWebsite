import jwt, { JwtPayload } from "jsonwebtoken";

export const verifyToken = (token: string) => {
      return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
}