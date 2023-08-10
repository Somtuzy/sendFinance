import Joi from "joi";

export const LoginAdminSchema = Joi.object({
  password: Joi.string().min(8).required(),
  adminSecret: Joi.string().required()
});