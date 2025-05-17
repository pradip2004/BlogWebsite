import mongoose from "mongoose";
import { IUser } from "../types/user.js";


const userSchema = new mongoose.Schema<IUser>({
      name: {
            type: String,
            required: true,
      },
      email: {
            type: String,
            required: true,
            unique: true,
      },
      image: {
            type: String,
            required: true,
      },
      instagram: {
            type: String,
            required: false,
      },
      facebook: {
            type: String,
            required: false,
      },
      linkedin: {
            type: String,
            required: false,
      },
      bio: {
            type: String,
            required: false,
      },
}, { timestamps: true });


const User = mongoose.model<IUser>("User", userSchema);



export default User;