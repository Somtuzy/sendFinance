import {Schema} from 'mongoose';

export interface ITransaction {
    sender: Schema.Types.ObjectId;
    senderTag: string;
    amount: number;
    status: string;
    receiver: Schema.Types.ObjectId;
    receiverTag: string
}

export interface ITransfer {
  sender: string;
  senderTag: string;
  amount: number;
  receiver: string;
  receiverTag: string
}