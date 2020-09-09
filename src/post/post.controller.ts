import { NextFunction, Request, Response, Router, request } from 'express';
// import Post from './post.interface';
import postModel from './post.model';
import validationMiddleware from '../middleware/validation.middleware';
import CreatePostDto from './post.dto';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import authMiddleware from '../middleware/auth.middleware';
import RequestWithUser from 'interfaces/requestWithUser.interface';
import { getRepository } from 'typeorm';
import Post from './post.entity';

class PostsController {
  public path = '/posts';
  public router = Router();
  // private post = postModel;
  private postRepository = getRepository(Post);

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPostById);
    this.router
      .all(`${this.path}/*`, authMiddleware)
      .patch(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.modifyPost)
      .delete(`${this.path}/:id`, this.deletePost);
    this.router.post(this.path, this.createPost);
  }

  private getAllPosts = async (request: Request, response: Response) => {
    const posts = await this.postRepository.find({ relations: ['categories'] }); // .populate('author', '-password'); // Op query wordt automatisch ge-exec na await
    response.send(posts);
  };

  private getPostById = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    const post = await this.postRepository.findOne(id, { relations: ['categories'] });
    if (post) {
      response.send(post);
    } else {
      next(new PostNotFoundException(id));
    }
  };

  private modifyPost = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    const postData: Post = request.body;
    await this.postRepository.update(id, postData);
    const post = await this.postRepository.findOne(id);
    if (post) {
      response.send(post);
    } else {
      next(new PostNotFoundException(id));
    }
  };

  private createPost = async (request: RequestWithUser, response: Response) => {
    const postData: CreatePostDto = request.body;
    const createdPost = this.postRepository.create({ ...postData, author: request.user });
    await this.postRepository.save(createdPost);
    // await savedPost.populate('author', '-password').execPopulate();
    response.send(createdPost);
  };

  private deletePost = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    const deleteResponse = await this.postRepository.delete(id);
    if (deleteResponse.raw[1]) {
      response.send(200);
    } else {
      next(new PostNotFoundException(id));
    }
  };
}

export default PostsController;
