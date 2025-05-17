import { Request, Response } from "express";
import User from "../model/user.js";
import { generateToken } from "../utils/jwtToken.js";
import { AuthReq } from "../types/AuthReq.js";
import getBuffer from "../utils/dataUri.js";
import { v2 as cloudinary } from 'cloudinary';

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

export const getUserProfile = async (req: Request, res: Response): Promise<any> => {
      try {
            const user = await User.findById(req.params.id);
            console.log("user: ", user);
            if (!user) {
                  return res.status(404).json({
                        message: "User not found"
                  })
            }

            res.status(200).json(user)
      } catch (error: any) {
            res.status(500).json({
                  message: error.message
            })
            console.log("error in getUserProfile");
      }
}


export const updateUserProfile = async (req: AuthReq, res: Response): Promise<void> => {
      try {
            const { name, instagram, facebook, linkedin, bio } = req.body;
            if (!req.user?._id) {
                  res.status(400).json({ message: "User ID missing from request" });
                  return;
            }

            const user = await User.findByIdAndUpdate(req.user?._id, {
                  name,
                  instagram,
                  facebook,
                  linkedin,
                  bio
            }, {
                  new: true
            });

            if (!user) {
                  res.status(404).json({ message: "User not found" });
                  return;
            }

            const token = generateToken(user)

            res.json({
                  message: "User updated successfully",
                  user: user,
                  token
            })
      } catch (error: any) {
            res.status(500).json({
                  message: error.message
            })
            console.log("error in updateUserProfile");

      }

}

export const updateProfilePic = async (req: AuthReq, res: Response): Promise<void> => {
      try {
            const file = req.file;
            if (!file) {
                  res.status(400).json({ message: "No file uploaded" });
                  return;
            }

            const fileBuffer = getBuffer(file);
            if (!fileBuffer || !fileBuffer.content) {
                  res.status(400).json({ message: "Error in file buffer" });
                  return;
            }
            const cloud = await cloudinary.uploader.upload(fileBuffer.content, {
                  folder: "blogs"
            })

            const user = await User.findByIdAndUpdate(req.user?._id, {
                  image: cloud.secure_url
            }, {
                  new: true
            })
            if (!user) {
                  res.status(404).json({ message: "User not found" });
                  return;
            }
            const token = generateToken(user)

            res.json({
                  message: "User updated successfully",
                  user: user,
                  token
            })
      } catch (error: any) {
            res.status(500).json({
                  message: error.message
            });
            console.log("error in updateProfilePic");
      }
}