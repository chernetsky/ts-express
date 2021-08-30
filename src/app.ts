/* eslint-disable no-console */
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as mongoose from 'mongoose';
import Controller from './interfaces/controller.interface';
import errorMiddleware from './middleware/error.middleware';

class App {
  public app: express.Application;

  public port: number;

  constructor(controllers: Controller[]) {
    this.app = express();

    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  // eslint-disable-next-line class-methods-use-this
  private connectToTheDatabase() {
    const {
      MONGO_USER,
      MONGO_PASSWORD,
      MONGO_PATH,
    } = process.env;

    mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      });

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
      // we're connected!
      console.log('db connected');
    });
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`App listening on the port ${process.env.PORT}`);
    });
  }
}

export default App;
