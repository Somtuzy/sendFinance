import Account from '../models/account.model';
import { Model } from 'mongoose';
import {
  IAccount,
  ICreateAccount,
  IUpdateAccount,
} from '../interfaces/account.interface';

class AccountService {
  constructor(public model: Model<IAccount>) {
    this.model = model;
  }

  async create(data: ICreateAccount) {
    return new this.model(data);
  }

  async updateOne(id: string, data: IUpdateAccount) {
    return await this.model.findByIdAndUpdate({ _id: id }, data, { new: true });
  }

  async deleteOne(id: string) {
    return await this.model.findByIdAndDelete({ _id: id });
  }

  async findOne(filter: Partial<IAccount>) {
    return await this.model.findOne(filter);
  }

  async findAll(filter: Partial<IAccount>) {
    return await this.model.find(filter);
  }
}

const accountService = new AccountService(Account);
export default accountService;
