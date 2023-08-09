import { model, Schema } from "mongoose";
import {IUser} from "../../interfaces/v1/user.interface";

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
      required: true,
      minlength: 8,
    },
    account: {
        type: Schema.Types.ObjectId,
        ref: "Accounts",
    },
    birthday: {
      type: String,
      required: false
    },
    address: {
      type: String,
      required: false
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