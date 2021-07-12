import * as mongoose from 'mongoose';
import 'dotenv/config';
import App from './app';
import PostsController from './posts/posts.controller';


const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_PATH,
  PORT
} = process.env;
// mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`);



const app = new App([
  new PostsController()
], PORT);

app.listen();