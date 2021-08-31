import {
  Router, Request, Response, NextFunction,
} from 'express';
import UserModel from '../users/user.model';
import Controller from '../interfaces/controller.interface';

class ReportController implements Controller {
  public path = '/report';

  public router = Router();

  private user = UserModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.getReport);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private getReport = async (req: Request, res: Response, next: NextFunction) => {
    const usersByCountries = await this.user.aggregate([
      {
        $match: {
          'address.country': {
            $exists: true,
          },
        },
      },
      {
        $group: {
          _id: {
            country: 'address.country',
          },
          users: {
            $push: {
              _id: '$_id',
              name: '$name',
            },
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $lookup: {
          from: 'posts',
          localField: 'users._id',
          foreignField: 'author',
          as: 'articles',
        },
      },
      {
        $addFields: {
          amountOfArticles: {
            $size: '$articles',
          },
        },
      },
      {
        $sort: {
          amountOfArticles: 1,
        },
      },
    ]);

    res.send({
      usersByCountries,
    });
  }
}

export default ReportController;
