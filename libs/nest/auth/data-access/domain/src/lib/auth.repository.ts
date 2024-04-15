import { AuthProvider, AuthUser } from "./interfaces";

export interface AuthRepository {
  findAuthBySub: (provider: AuthProvider, sub: string) => Promise<AuthUser>;
  findOrCreate: (provider: AuthProvider, sub: string, email: string, name: string) => Promise<AuthUser>;
}
