import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

const path = require('path');

describe('AuthService', () => {
  let service: AuthService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          global: true,
          secret: 'XXXXXXXXXXXXXX',
          signOptions: { expiresIn: '999s' },
        }),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: path.resolve(__dirname, 'data/db.service.test.sq3'),
          entities: [User],
          synchronize: true,
          dropSchema: true,
        }),
        TypeOrmModule.forFeature([User]),
      ],
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const input = {
    username: 'user',
    password: 'password',
  };

  let access_token: string;

  it('tests register method', async () => {
    const result = await service.register(input);
    expect(result.username).toBe(input.username);
    expect(result.access_token).toBeDefined();
  });

  it('tests login method', async () => {
    const result = await service.login(input);
    access_token = result.access_token;
    expect(result.username).toBe(input.username);
    expect(result.access_token).toBeDefined();
  });

  it('tests decodeToken method', async () => {
    const result = await service.verify({
      access_token,
    });
    expect(result).toEqual({
      exp: expect.any(Number),
      iat: expect.any(Number),
      sub: expect.any(String),
      username: input.username,
    });
  });
});
