import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { genSalt, hash } from 'bcrypt';

export interface RegisterInput extends Pick<User, 'username' | 'password'> {}

export interface LoginInput extends Pick<User, 'username' | 'password'> {}

export interface ValidateTokenInput {
  access_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    public authRepository: Repository<User>,
    @InjectRepository(User)
    public userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register({ username, password }: RegisterInput): Promise<{
    username: string;
    access_token: string;
  }> {
    console;
    try {
      const salt = await genSalt(10);
      const hashPassword = await hash(password, salt);
      const auth = await this.authRepository.save(
        this.authRepository.create({
          username,
          password: hashPassword,
          salt,
        }),
      );
      return {
        username: auth.username,
        access_token: await this.jwtService.signAsync({
          username: auth.username,
          sub: auth.user_id,
        }),
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        String(error).includes('SQLITE_CONSTRAINT: UNIQUE')
          ? 'username already exists'
          : String(error),
      );
    }
  }

  async login({ username, password }: LoginInput): Promise<{
    username: string;
    access_token: string;
  }> {
    const auth = await this.authRepository
      .createQueryBuilder('auth')
      .where('auth.username = :username', {
        username,
      })
      .addSelect('auth.password')
      .addSelect('auth.salt')
      .getOne();

    if (!auth) {
      const message = 'User not found';
      console.log(message);
      throw new UnauthorizedException(message);
    }
    const hashPassword = await hash(password, auth.salt);
    if (auth.username !== username) {
      const message = 'username miss match';
      console.log(message);
      throw new UnauthorizedException(message);
    }
    if (auth.password !== hashPassword) {
      const message = 'password miss match';
      console.log(message);
      throw new UnauthorizedException(message);
    }

    return {
      username: auth.username,
      access_token: await this.jwtService.signAsync({
        username: auth.username,
        sub: auth.user_id,
      }),
    };
  }

  async verify({
    access_token,
  }: ValidateTokenInput): Promise<Pick<User, 'username' | 'user_id'>> {
    return this.jwtService.verifyAsync(access_token);
  }
}
