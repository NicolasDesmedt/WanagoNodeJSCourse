import HttpException from './HttpException';

class CategoryNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Invalid category with id ${id}`);
  }
}

export default CategoryNotFoundException;
