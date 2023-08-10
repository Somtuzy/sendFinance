import Joi from 'joi'

export const CreateAccountSchema = Joi.object({
  uniqueTag: Joi.string().min(3).max(15).required(),
  pin: Joi.string().pattern(/^\d{4}$/).required()
});
