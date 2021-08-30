import {
  NextFunction, Request, Response, Router,
} from 'express';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import authMiddleware from '../middleware/auth.middleware';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import validationMiddleware from '../middleware/validation.middleware';
import CreatePostDto from './post.dto';
import Post from './post.interface';
import PostModel from './post.model';

class PostsController {
  public path = '/posts';

  public router = Router();

  private post = PostModel;

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPostById);
    this.router
      .all(`${this.path}/*`, authMiddleware)
      .patch(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.modifyPost)
      .delete(`${this.path}/:id`, this.deletePost)
      .post(this.path, authMiddleware, validationMiddleware(CreatePostDto), this.createPost);
  }

  getAllPosts = async (request: Request, response: Response) => {
    const posts = await this.post.find()
      .populate('author', '-password');

    response.send(posts);
  }

  getPostById = async (request: Request, response: Response, next: NextFunction) => {
    const { id } = request.params;
    const post = await this.post.findById(id);

    if (post) {
      response.send(post);
    } else {
      next(new PostNotFoundException(id));
    }
  }

  createPost = async (request: RequestWithUser, response: Response) => {
    const postData: Post = request.body;
    const createdPost = new this.post({
      ...postData,
      author: request.user._id,
    });

    const savedPost = await createdPost.save();
    await savedPost.populate('author', '-password').execPopulate();
    response.send(savedPost);
  }

  modifyPost = async (request: Request, response: Response, next: NextFunction) => {
    const { id } = request.params;
    const postData: Post = request.body;
    const post = await this.post.findByIdAndUpdate(id, postData, { new: true });

    if (post) {
      response.send(post);
    } else {
      next(new PostNotFoundException(id));
    }
  }

  deletePost = async (request: Request, response: Response, next: NextFunction) => {
    const { id } = request.params;
    const deleteResult = await this.post.findByIdAndDelete(id);

    if (deleteResult) {
      response.send(200);
    } else {
      next(new PostNotFoundException(id));
    }
  }
}

export default PostsController;
