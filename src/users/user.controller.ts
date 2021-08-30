import { Router, Response, NextFunction } from 'express';
import NotAuthorizedException from '../exceptions/NotAuthorizedException';
import PostModel from '../posts/post.model';

import Controller from '../interfaces/controller.interface';
import authMiddleware from '../middleware/auth.middleware';
import RequestWithUser from '../interfaces/requestWithUser.interface';

class UserController implements Controller {
  public path = '/users';

  public router = Router();

  private post = PostModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:id/posts`, authMiddleware, this.getPostsByUser);
  }

  private getPostsByUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    if (userId === req.user._id.toString()) {
      const posts = await this.post.find({ author: userId });
      res.send(posts);
    } else {
      next(new NotAuthorizedException());
    }
  }
}

export default UserController;
