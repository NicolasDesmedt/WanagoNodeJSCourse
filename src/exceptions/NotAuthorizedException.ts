import HttpException from './HttpException';

class NotAuthorizedException extends HttpException {
  constructor() {
    super(400, `Page is unavailable`);
  }
}

export default NotAuthorizedException;
