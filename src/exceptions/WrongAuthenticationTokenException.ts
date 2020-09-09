import HttpException from './HttpException';

class WrongAuthenticationToken extends HttpException {
  constructor() {
    super(400, `Please provide valid token`);
  }
}

export default WrongAuthenticationToken;
