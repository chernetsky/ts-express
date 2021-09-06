import 'dotenv/config';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import config from './ormconfig';
import App from './app';
import PostController from './posts/post.controller';
import AuthenticationController from './authentication/authentication.controller';
// import ReportController from './report/report.controller';
import CategoryController from './category/category.controller';
import validateEnv from './utils/validateEnv';

validateEnv();

(async () => {
  try {
    await createConnection(config);
  } catch (error) {
    console.log('Error while connecting to the database', error);
    return error;
  }
  const app = new App([
    new PostController(),
    new CategoryController(),
    new AuthenticationController(),
    // new ReportController(),
  ]);

  return app.listen();
})();
