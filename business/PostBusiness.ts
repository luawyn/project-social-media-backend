import { PostDatabase } from "../database/PostDatabase";
import {
  GetPostsOutputDTO,
  GetPostsInputDTO,
  CreatePostInputDTO,
  EditPostInputDTO,
} from "../dtos/userDTO";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { Post } from "../models/Post";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { PostDB, PostWithCreatorsDB } from "../types";

export class PostBusiness {
  constructor(
    private postDatabase: PostDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager
  ) {}
  public getPosts = async (
    input: GetPostsInputDTO
  ): Promise<GetPostsOutputDTO> => {
    const { token } = input;
    if (token === undefined) {
      throw new BadRequestError("token ausente");
    }
    const payload = this.tokenManager.getPayload(token);
    if (payload === null) {
      throw new BadRequestError("token invalido");
    }
    const postsWithCreatorsDB: PostWithCreatorsDB[] =
      await this.postDatabase.getPostsWithCreators();
    const posts = postsWithCreatorsDB.map((postWithCreatorDB) => {
      const post = new Post(
        postWithCreatorDB.id,
        postWithCreatorDB.context,
        postWithCreatorDB.likes,
        postWithCreatorDB.dislikes,
        postWithCreatorDB.created_at,
        postWithCreatorDB.updated_at,
        postWithCreatorDB.creator_id,
        postWithCreatorDB.creator_name
      );
      return post.toBusinessModel();
    });
    const output: GetPostsOutputDTO = posts;
    return output;
  };
  public createPost = async (input: CreatePostInputDTO): Promise<void> => {
    const { token, context } = input;
    if (token === undefined) {
      throw new BadRequestError("token ausente");
    }
    const payload = this.tokenManager.getPayload(token);
    if (payload === null) {
      throw new BadRequestError("token invalido");
    }
    if (typeof context !== "string") {
      throw new BadRequestError("'context' deve ser string");
    }
    const id = this.idGenerator.generate();
    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();
    const creatorId = payload.id;
    const creatorName = payload.name;

    const post = new Post(
      id,
      context,
      0,
      0,
      createdAt,
      updatedAt,
      creatorId,
      creatorName
    );
    const postDB = post.toDBModel();
    await this.postDatabase.insert(postDB);
  };
  public editPost = async (input: EditPostInputDTO): Promise<void> => {
    const { idToEdit, token, context } = input;
    if (token === undefined) {
      throw new BadRequestError("token ausente");
    }
    const payload = this.tokenManager.getPayload(token);
    if (payload === null) {
      throw new BadRequestError("token invalido");
    }
    if (typeof context !== "string") {
      throw new BadRequestError("'context' deve ser string");
    }
    const postDB = await this.postDatabase.findById(idToEdit);

    if (!postDB) {
      throw new NotFoundError("'id' nao encontrado");
    }
    const creatorId = payload.id;
    if (postDB.creator_id !== creatorId) {
      throw new BadRequestError("Somente quem criou o post pode edita-lo");
    }
    const creatorName = payload.name;
    const post = new Post(
      postDB.id,
      postDB.context,
      postDB.likes,
      postDB.dislikes,
      postDB.created_at,
      postDB.updated_at,
      creatorId,
      creatorName
    );
    post.setContext(context);
    post.setUpdatedAt(new Date().toISOString());
    const newPostDB = post.toDBModel();
    await this.postDatabase.update(idToEdit, newPostDB);
  };
}
