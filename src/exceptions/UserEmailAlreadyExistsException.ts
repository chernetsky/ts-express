import HttpException from './HttpException';

class UserEmailAlreadyExistsException extends HttpException {
  constructor(email: string) {
    super(400, `Email ${email} already exists`);
  }
}

export default UserEmailAlreadyExistsException;
