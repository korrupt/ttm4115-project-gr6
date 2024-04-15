import { User } from "./interfaces";
import { EntityManager } from "typeorm";

export interface UserRepository {
  findById: (id: string) => Promise<User>;
  save: (em: EntityManager, user: User) => Promise<User>;
}
