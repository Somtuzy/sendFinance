import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';
import { ICreateUser } from '../../interfaces/v1/user.interface';

const validator =
  (schema: { validateAsync: (arg0: ICreateUser) => any }, source = 'body') =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const _source = source === 'body' ? req.body : req.query;
      let value = await schema.validateAsync(_source);
      if (source === 'body') {
        // const unfilteredReqBody = req?.body; // for debugging purposes
        req.body = value;
      }
      if (source === 'query') {
        // const unfilteredReqQuery = req?.query; // for debugging purposes
        req.query = value;
      }
      return next();
    } catch (err: any) {
      return res.status(500).json({
        message: err.message,
        success: false,
      });
    }
  };

export default validator;
