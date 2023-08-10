import { Schema } from 'mongoose'

export interface IAccount {
    _id: string;
    userId: Schema.Types.ObjectId;
    uniqueTag: string;
    balance: number;
    status: string;
    pin: string;
    deleted: boolean;
}

export interface ICreateAccount {
  userId: string;
  uniqueTag: string;
  pin: string;
}

export interface IUpdateAccount {
  balance: number;
}