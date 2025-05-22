import { Request } from 'express';
import { IUser } from '../models/user.model';
import { ICaptain } from '../models/captain.model';

declare global {
  namespace Express {
    interface Request {
      user?: IUser | null;
      captain?: ICaptain | null;
    }
  }
}
