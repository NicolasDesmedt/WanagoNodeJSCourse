import HttpException from './HttpException';

class UserWithEmailAlreadyExistsException extends HttpException {
  constructor(email: String) {
    super(400, `User email is already used`);
  }
}

export default UserWithEmailAlreadyExistsException;
