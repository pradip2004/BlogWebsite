import { Document } from 'mongoose';
export interface IUser extends Document {
      name: string;
      email: string;
      image: string;
      instagram: string;
      facebook: string;
      linkedin: string;
      bio: string;
}