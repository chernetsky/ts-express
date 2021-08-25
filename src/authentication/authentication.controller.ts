import * as bcrypt from 'bcrypt';
import * as express from 'express';
import UserEmailAlreadyExistsException from '../exceptions/UserEmailAlreadyExistsException';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';
import Controller from '../interfaces/controlles.interface';
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
        response.send(user);
      } else {
        next(new WrongCredentialsException());
      }
    } else {
      next(new WrongCredentialsException());
    }
  }
}

export default AuthenticationController;
