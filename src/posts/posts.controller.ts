import PostNotFoundException from "../exceptions/PostNotFoundException"
import { NextFunction, Request, Response, Router } from "express"
import Post from './post.interface';
import postModel from './posts.model';

class PostsController {
  public path = '/posts';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPostById);
    this.router.post(this.path, this.createPost);
    this.router.patch(`${this.path}/:id`, this.modifyPost);
    this.router.delete(`${this.path}/:id`, this.deletePost);
  }

  getAllPosts = (request: Request, response: Response) => {
    postModel.find()
      .then(posts => {
        response.send(posts);
      });
  }

  getPostById = (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    postModel.findById(id)
      .then(post => {
        if (post) {
          response.send(post);
        } else {
          next(new PostNotFoundException(id));
        }
      });
  }

  createPost = (request: Request, response: Response) => {
    const postData: Post = request.body;
    const createdPost = new postModel(postData);

    createdPost.save()
      .then(savedPost => {
        response.send(savedPost);
      });
  }

  modifyPost = (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    const postData: Post = request.body;
    postModel.findByIdAndUpdate(id, postData, { new: true })
      .then(post => {
        if (post) {
          response.send(post);
        } else {
          next(new PostNotFoundException(id));
        }
      });
  }

  deletePost = (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    postModel.findByIdAndDelete(id)
      .then(successResponse => {
        if (successResponse) {
          response.send(200);
        } else {
          next(new PostNotFoundException(id));
        }
      })
  }
}

export default PostsController;