import HttpException from './HttpException';

class WrongCredentialsException extends HttpException {
  constructor() {
    super(400, `Credentials do not match`);
  }
}

export default WrongCredentialsException;
