import Joi from 'joi';

export const CreateTransactionSchema = Joi.object({
  senderTag: Joi.string().min(3).max(15).required(),
  amount: Joi.number().required(),
  receiverTag: Joi.string().min(3).max(15).required(),
});

export const FundAccountSchema = Joi.object({
  uniqueTag: Joi.string().min(3).max(15).required(),
  amount: Joi.number().required()
});