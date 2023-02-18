import { UserDatabase } from "../database/UserDatabase";
import { SignupInputDTO, SignupOutputDTO } from "../dtos/userDTO";
import { User } from "../models/User";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { TokenPayload, USER_ROLES } from "../types";

export class UserBusiness {
  constructor(
    private userDatabase: UserDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager,
    private hashManager: HashManager
  ) {}
  public signup = async (input: SignupInputDTO): Promise<SignupOutputDTO> => {
    const { name, email, password } = input;
    if (typeof name !== "string") {
      throw new Error("'name' deve ser string");
    }
    if (typeof email !== "string") {
      throw new Error("'email' deve ser string");
    }
    if (typeof password !== "string") {
      throw new Error("'password' deve ser string");
    }

    const id = this.idGenerator.generate();
    const role = USER_ROLES.NORMAL;
    const createdAt = new Date().toISOString();

    const newUser = new User(id, name, email, password, role, createdAt);

    const userDB = newUser.toDBModel();

    await this.userDatabase.insert(userDB);

    const payload: TokenPayload = {
      id: newUser.getId(),
      name: newUser.getName(),
      role: newUser.getRole(),
    };

    const token = this.tokenManager.createToken(payload);

    const output: SignupOutputDTO = {
      token,
    };
    return output;
  };
}
