import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Req,
  UnauthorizedException,
  Res,
} from '@nestjs/common';
import {
  RegisterInput,
  AuthService,
  LoginInput,
  ValidateTokenInput,
} from './auth.service';
import { Response } from 'express';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get("/")
  test () {
    return "ok"
  }

  @HttpCode(HttpStatus.OK)
  @Post('/register')
  async register(@Body() body: RegisterInput) {
    return this.authService.register(body);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Body() body: LoginInput) {
    return this.authService.login(body);
  }

  @HttpCode(HttpStatus.OK)
  @Get(['/', '/verify'])
  async verify(@Req() req: Request, @Res() res: Response) {
    try {
      const access_token = (
        req?.headers as { authorization?: string }
      )?.authorization.replace('Bearer ', '');
      const result = await this.authService.verify({
        access_token,
      });
      return res.set({ 'x-user-id': result.user_id }).json(result);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
