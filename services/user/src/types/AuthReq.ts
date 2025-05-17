import { Request } from "express";
import { IUser } from "./user.js";


export interface AuthReq extends Request {
      user?: IUser | null;
}