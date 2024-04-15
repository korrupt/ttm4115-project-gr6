import { User } from "@prosjekt/nest/user/data-access/domain";
import { AuthProvider } from "./interfaces";

export interface AuthRepository {
  findUserBySub: (provider: AuthProvider, sub: string) => Promise<User>;
}
