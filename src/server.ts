import 'dotenv/config';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import App from './app';
import * as config from './ormconfig';
import PostsController from './post/post.controller';
import validateEnv from './utils/validateEnv';
import AuthenticationController from 'authentication/authentication.controller';
import CategoryController from 'category/category.controller';
import AddressController from 'address/address.controller';

validateEnv();

// const app = new App([new PostsController(), new AuthenticationController(), new UserController(), new ReportController()]);

(async () => {
  try {
    const connection = await createConnection(config);
    await connection.runMigrations();
  } catch (error) {
    console.log('Error while connecting to database', error);
    return error;
  }
  const app = new App([new PostsController(), new AuthenticationController(), new AddressController(), new CategoryController()]);
  app.listen();
})();
