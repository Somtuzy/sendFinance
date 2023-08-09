import { Schema } from "mongoose";

export interface IUser{
  _id: string;
  fullname: string;
  avatar: string;
  uniqueTag: string;
  email: string;
  phoneNumber: string;
  password: string;
  birthday: string;
  account: Schema.Types.ObjectId;
  address: string;
  role: string;
  verified: boolean;
  deleted: boolean;
}

export interface ICreateUser {
  fullname: string;
  avatar: string;
  email: string;
  phoneNumber?: string;
  password: string;
  birthday?: string;
  address?: string;
}

export interface IUpdateUser {
  fullname?: string;
  avatar?: string;
  email?: string;
  password?: string;
  birthday?: Date;
  account?: string;
  address?: string;
  verified?: boolean;
  deleted?: boolean;
}