
export interface IUser{
  _id: string;
  fullname: string;
  avatar: string;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  birthday: string;
  address: string;
  role: string;
  verified: boolean;
  deleted: boolean;
}

export interface ICreateUser {
  fullname: string;
  avatar: string;
  email: string;
  username: string;
  phoneNumber?: string;
  password: string;
  birthday?: string;
  address?: string;
  role?: string;
}

export interface IUpdateUser {
  fullname?: string,
  avatar?: string,
  email?: string,
  password?: string,
  birthday?: Date,
  address?: string,
  role?: string,
  verified?: boolean,
  deleted?: boolean,
}