import {
  NextFunction, Request, Response, Router,
} from 'express';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import validationMiddleware from '../middleware/validation.middleware';
import CreatePostDto from './post.dto';
import Post from './post.interface';
import PostModel from './posts.model';

class PostsController {
  public path = '/posts';

  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPostById);
    this.router.post(this.path, validationMiddleware(CreatePostDto), this.createPost);
    this.router.patch(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.modifyPost);
    this.router.delete(`${this.path}/:id`, this.deletePost);
  }

  getAllPosts = (request: Request, response: Response) => {
    PostModel.find()
      .then((posts) => {
        response.send(posts);
      });
  }

  getPostById = (request: Request, response: Response, next: NextFunction) => {
    const { id } = request.params;
    PostModel.findById(id)
      .then((post) => {
        if (post) {
          response.send(post);
        } else {
          next(new PostNotFoundException(id));
        }
      });
  }

  createPost = (request: Request, response: Response) => {
    const postData: Post = request.body;
    const createdPost = new PostModel(postData);

    createdPost.save()
      .then((savedPost) => {
        response.send(savedPost);
      });
  }

  modifyPost = (request: Request, response: Response, next: NextFunction) => {
    const { id } = request.params;
    const postData: Post = request.body;
    PostModel.findByIdAndUpdate(id, postData, { new: true })
      .then((post) => {
        if (post) {
          response.send(post);
        } else {
          next(new PostNotFoundException(id));
        }
      });
  }

  deletePost = (request: Request, response: Response, next: NextFunction) => {
    const { id } = request.params;
    PostModel.findByIdAndDelete(id)
      .then((successResponse) => {
        if (successResponse) {
          response.send(200);
        } else {
          next(new PostNotFoundException(id));
        }
      });
  }
}

export default PostsController;
