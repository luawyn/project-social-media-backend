import { PostDatabase } from "../database/PostDatabase";
import { GetPostsOutputDTO, GetPostsInputDTO } from "../dtos/userDTO";
import { BadRequestError } from "../errors/BadRequestError";
import { Post } from "../models/Post";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { PostWithCreatorsDB } from "../types";

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
}
