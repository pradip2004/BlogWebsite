import { NextFunction, Response } from "express";
import { AuthReq } from "../types/AuthReq.js";
import { verifyToken } from "../utils/jwtToken.js";


export const isAuth = async (req: AuthReq, res: Response, next: NextFunction) :  Promise<void>  => {
      try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token || req.headers.authorization?.split(" ")[0] !== "Bearer") {
                  res.status(401).json({ message: "Unauthorized" });
                  return;
            }

            const decoded = await verifyToken(token);
            if (!decoded) {
                  console.log("Decoded token is null");
                  res.status(401).json({ message: "Unauthorized" });
                  return;
            }
            console.log("Decoded token: ", decoded);

            req.user = decoded.user;
            next();
      } catch (error) {
            console.log("JWT varification error: " ,error);
            res.status(400).json({
                  message: "jwt error"
            })
      }


}