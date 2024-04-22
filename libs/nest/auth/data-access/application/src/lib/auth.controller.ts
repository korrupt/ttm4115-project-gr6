import { Controller, Get, HttpStatus, Inject, Req, Res, UseGuards } from "@nestjs/common";
import { GoogleGuard } from "./guards/google.guard";
import type { Request, Response } from 'express';
import { AuthToken, AuthRepository, AuthProvider } from "@prosjekt/nest/auth/data-access/domain";
import { JwtService } from "@nestjs/jwt";
import { AuthPayload, JWT } from "@prosjekt/shared/models";

interface GoogleResponse {
  provider: 'google';
  sub: string;
  displayName: string;
  email: string;
}


@Controller('auth')
export class AuthController {

  constructor(
    @Inject(AuthToken.AUTH_REPOSITORY) private auth: AuthRepository,
    private jwt: JwtService
  ){}

  @Get('google')
  @UseGuards(GoogleGuard)
  /* eslint-disable @typescript-eslint/no-empty-function */
  public async googleSignin() {}

  @Get('google/callback')
  @UseGuards(GoogleGuard)
  public async goolgeInfo(@Req() req: Request, @Res() res: Response): Promise<JWT> {
    const user = req.user as GoogleResponse;
    const auth = await this.auth.findOrCreate(AuthProvider.GOOGLE, user.sub, user.email, user.displayName);

    const access_token = await this.jwt.signAsync({
      sub: auth.id,
      email: auth.email,
    });

    res.status(HttpStatus.OK);

    return res.json({ access_token }) as unknown as JWT;
  }

}
