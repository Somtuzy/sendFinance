import { model, ObjectId, Schema } from "mongoose";
import {IUser} from "../interfaces/user.interface";

const userSchema = new Schema<IUser>(
  {
    fullname: {
      type: String,
      lowercase: true,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 40,
    },
    avatar: String,
    username: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      minlength: 11,
      maxlength: 14,
      required: false,
    },
    password: {
      type: String,
      required: false,
      minlength: 8,
    },
    birthday: {
      type: String,
    },
    address: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    deleted: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

const User = model<IUser>("User", userSchema);
export default User;