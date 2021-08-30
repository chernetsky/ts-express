import * as bcrypt from 'bcrypt';
import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import User from 'users/user.interface';
import TokenData from 'interfaces/tokenData.interface';
import DataStoredInToken from 'interfaces/dataStoredInToken.interface';
import UserEmailAlreadyExistsException from '../exceptions/UserEmailAlreadyExistsException';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';
import Controller from '../interfaces/controller.interface';
import validationMiddleware from '../middleware/validation.middleware';
import LogInDto from './logIn.dto';
import CreateUserDto from '../users/user.dto';
import UserModel from '../users/user.model';

class AuthenticationController implements Controller {
  public path = '/auth';

  public router = express.Router();

  private user = UserModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.registration);
    this.router.post(`${this.path}/login`, validationMiddleware(LogInDto), this.logginIn);
    this.router.post(`${this.path}/logout`, this.loggingOut);
  }

  private registration = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    const userData: CreateUserDto = request.body;

    if (await this.user.findOne({ email: userData.email })) {
      next(new UserEmailAlreadyExistsException(userData.email));
    } else {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await this.user.create({
        ...userData,
        password: hashedPassword,
      });

      user.password = undefined;

      const tokenData = this.createToken(user);

      response.set('Set-Cookie', [this.createCookie(tokenData)]);
      response.send(user);
    }
  }

  private logginIn = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    const logInData: LogInDto = request.body;
    const user = await this.user.findOne({ email: logInData.email });
    if (user) {
      const isPasswordMatching = await bcrypt.compare(logInData.password, user.password);
      if (isPasswordMatching) {
        user.password = undefined;

        const tokenData = this.createToken(user);

        response.set('Set-Cookie', [this.createCookie(tokenData)]);
        response.send(user);
      } else {
        next(new WrongCredentialsException());
      }
    } else {
      next(new WrongCredentialsException());
    }
  }

  private loggingOut = (request: express.Request, response: express.Response) => {
    response.set('Set-Cookie', ['Authorization=;Max-age=0']);
    response.send(200);
  }

  private createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }

  private createToken(user: User): TokenData {
    const expiresIn = 60 * 60; // 1 hour
    const secret = process.env.JWT_SECRET;

    const dataStoredInToken: DataStoredInToken = {
      // eslint-disable-next-line no-underscore-dangle
      _id: user._id,
    };

    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }
}

export default AuthenticationController;
