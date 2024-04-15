import { JwtPayload } from "jwt-decode";

export type JWT = {
  access_token: string;
}

export type AuthPayload = Required<Pick<JwtPayload, 'iat' | 'exp' | 'sub'>> & {
  email: string;
}
