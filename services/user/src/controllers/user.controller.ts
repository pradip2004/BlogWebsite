import { Request, Response } from "express";
import User from "../model/user.js";
import { generateToken } from "../utils/jwtToken.js";
import { AuthReq } from "../types/AuthReq.js";

export const loginUser = async (req: Request, res: Response) => {
      try {
            const { email, name, image } = req.body;

            let user = await User.findOne({ email });
            if (!user) {
                  user = await User.create({
                        email,
                        name,
                        image
                  })
            }

            const token = generateToken(user);
            res.status(201).json({
                  message: "User created successfully",
                  user: user,
                  token
            })
      } catch (error: any) {
            res.status(500).json({
                  message: error.message
            })
            console.log("error in loginUser");
      }
}

export const myProfile = async (req: AuthReq, res: Response) => {
      try {
            const user = req.user;
            res.json(user);
      } catch (error: any) {
            res.status(500).json({
                  message: error.message
            })
            console.log("error in myProfile");
      }
}