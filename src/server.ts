import 'dotenv/config';
import App from './app';
import PostController from './posts/post.controller';
import UserController from './users/user.controller';
import AuthenticationController from './authentication/authentication.controller';
import ReportController from './report/report.controller';
import validateEnv from './utils/validateEnv';

validateEnv();

const app = new App([
  new PostController(),
  new UserController(),
  new AuthenticationController(),
  new ReportController(),
]);

app.listen();
