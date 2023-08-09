import { Model } from 'mongoose';
import { ITransaction, ITransfer } from '../../interfaces/v1/transaction.interface';
import Transaction from '../../models/v1/transaction.model';

class TransactionService {
  constructor(public model: Model<ITransaction>) {
    this.model = model;
  }

  async create(data: ITransfer) {
    return new this.model(data);
  }

  // async updateOne(id: string, data: ITransaction) {
  //   return await this.model.findByIdAndUpdate({ _id: id }, data, { new: true });
  // }

  async deleteOne(id: string) {
    return await this.model.findByIdAndDelete({ _id: id });
  }

  async findOne(filter: Partial<ITransaction>) {
    return await this.model.findOne(filter);
  }

  async findAll(filter: Partial<ITransaction>) {
    return await this.model.find(filter);
  }
}

const transactionService = new TransactionService(Transaction);
export default transactionService;
