import _ from 'lodash';
import mongoose from "mongoose";

export default function isValidObjectId (id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
};