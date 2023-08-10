import bcrypt from "bcrypt";

export const hashPassword = async (passwordInput: string): Promise<string> => {
  const salt = await bcrypt.genSalt(parseFloat(<string>process.env.ROUNDS));
  return await bcrypt.hash(passwordInput, salt);
};

export const verifyPassword = async (passwordInput: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(passwordInput, hashedPassword);
};

export const hashPin = async (passwordInput: string): Promise<string> => {
  const salt = await bcrypt.genSalt(parseFloat(<string>process.env.ROUNDS));
  return await bcrypt.hash(passwordInput, salt);
};

export const verifyPin = async (passwordInput: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(passwordInput, hashedPassword);
};