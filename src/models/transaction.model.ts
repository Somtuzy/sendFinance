import {model, Schema} from 'mongoose';
import { ITransaction } from '../interfaces/transaction.interface';

const transactionSchema = new Schema<ITransaction>({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    senderTag: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 15
  },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'successful', 'rejected'],
        default: 'pending',
        required: true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    receiverTag: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 15
  }
}, { 
    timestamps: {
        createdAt: true,
        updatedAt: false
    }
});

const Transaction = model<ITransaction>('Transaction', transactionSchema);
export default Transaction;
