declare namespace Express {
  export interface Request {
    user: {
      _id: string;
      fullname: string; 
      username: string;
      avatar: string;
      email: string;
      phoneNumber: string;
      role: string;
      verified: boolean;
      deleted: boolean;
    }
  }
}