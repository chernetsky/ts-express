import {
  NextFunction, Request, Response, Router,
} from 'express';
import { getRepository } from 'typeorm';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import authMiddleware from '../middleware/auth.middleware';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import validationMiddleware from '../middleware/validation.middleware';
import CreatePostDto from './post.dto';
import Post from './post.entity';

class PostsController {
  public path = '/posts';

  public router = Router();

  private postRepository = getRepository(Post);

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

  createPost = async (request: RequestWithUser, response: Response) => {
    const postData: CreatePostDto = request.body;
    const newPost = this.postRepository.create({
      ...postData,
      // author: request.user,
    });

    await this.postRepository.save(newPost);
    // newPost.author = undefined;
    response.send(newPost);
  }

  getAllPosts = async (request: Request, response: Response) => {
    const posts = await this.postRepository.find();
    response.send(posts);
  }

  getPostById = async (request: Request, response: Response, next: NextFunction) => {
    const { id } = request.params;
    const post = await this.postRepository.findOne(id);

    if (post) {
      response.send(post);
    } else {
      next(new PostNotFoundException(id));
    }
  }

  modifyPost = async (request: Request, response: Response, next: NextFunction) => {
    const { id } = request.params;
    const postData: Post = request.body;
    await this.postRepository.update(id, postData);
    const updatedPost = await this.postRepository.findOne(id);

    if (updatedPost) {
      response.send(updatedPost);
    } else {
      next(new PostNotFoundException(id));
    }
  }

  deletePost = async (request: Request, response: Response, next: NextFunction) => {
    const { id } = request.params;
    const deleteResponse = await this.postRepository.delete(id);

    if (deleteResponse[1]) {
      response.send(200);
    } else {
      next(new PostNotFoundException(id));
    }
  }
}

export default PostsController;
