import { AuthProvider, AuthUser } from "./interfaces";

import { EntityManager } from "typeorm";

export interface AuthRepository {
  findAuthBySub: (em: EntityManager, provider: AuthProvider, sub: string) => Promise<AuthUser>;
  findOrCreate: (em: EntityManager, provider: AuthProvider, sub: string, email: string, name: string) => Promise<AuthUser>;
}
