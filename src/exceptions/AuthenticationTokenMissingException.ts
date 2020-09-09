import HttpException from './HttpException';

class AuthenticationTokenMissingException extends HttpException {
  constructor() {
    super(400, `Please provide a token`);
  }
}

export default AuthenticationTokenMissingException;
