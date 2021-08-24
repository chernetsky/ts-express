import HttpException from './HttpException';

class UserEmailAlreadyExists extends HttpException {
  constructor(email: string) {
    super(400, `Email ${email} already exists`);
  }
}

export default UserEmailAlreadyExists;
