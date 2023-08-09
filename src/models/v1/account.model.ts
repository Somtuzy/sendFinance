import { model, Schema } from 'mongoose';
import { IAccount } from '../../interfaces/v1/account.interface';

const accountSchema = new Schema<IAccount>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    uniqueTag: {
      type: String,
      unique: true,
      maxlength: 15,
      minlength: 3,
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

const Account = model<IAccount>('Account', accountSchema);
export default Account;
