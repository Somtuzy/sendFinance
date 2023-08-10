import Joi from 'joi';

export const SendFundSchema = Joi.object({
  senderTag: Joi.string().min(3).max(15).required(),
  amount: Joi.number().required(),
  receiverTag: Joi.string().min(3).max(15).required(),
  pin: Joi.string()
    .pattern(/^\d{4}$/)
    .required(),
});

export const FundAccountSchema = Joi.object({
  amount: Joi.number().required(),
  pin: Joi.string()
    .pattern(/^\d{4}$/)
    .required(),
});
