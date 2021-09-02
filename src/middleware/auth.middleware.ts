import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import AuthenticationTokenMissingException from '../exceptions/AuthenticationTokenMissingException';
import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationTokenException';
import DataStoredInToken from '../interfaces/dataStoredInToken.interface';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import UserModel from '../users/user.model';

async function authMiddleware(request: RequestWithUser, response: Response, next: NextFunction) {
  next();
  // const { cookies } = request;
  // if (cookies && cookies.Authorization) {
  //   const secret = process.env.JWT_SECRET;
  //   try {
  //     const verificationResponse = jwt.verify(cookies.Authorization, secret) as DataStoredInToken;
  //     const id = verificationResponse._id;
  //     const user = await UserModel.findById(id);
  //     if (user) {
  //       request.user = user;
  //       next();
  //     } else {
  //       next(new WrongAuthenticationTokenException());
  //     }
  //   } catch (error) {
  //     next(new WrongAuthenticationTokenException());
  //   }
  // } else {
  //   next(new AuthenticationTokenMissingException());
  // }
}

export default authMiddleware;
