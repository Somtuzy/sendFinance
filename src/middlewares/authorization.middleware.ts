import { Request, Response, NextFunction } from "express";

export default function adminAccess(req: Request, res: Response, next: NextFunction): any {
  if(req.user.role !== "admin") {
    return res.status(403).json({
      success: false, 
      message: 'you are not allowed to perform this action.'
    })
  }

  next()
}