import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

const path = require('path');

describe('AuthController', () => {
  let controller: AuthController;

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
          database: path.resolve(__dirname, 'data/db.controller.test.sq3'),
          entities: [User],
          synchronize: true,
          dropSchema: true,
        }),
        TypeOrmModule.forFeature([User]),
      ],
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  const input = {
    username: 'user',
    password: 'password',
  };

  let access_token: string;

  it('tests register method', async () => {
    const result = await controller.register(input);
    expect(result.username).toBe(input.username);
    expect(result.access_token).toBeDefined();
  });

  it('tests login method', async () => {
    const result = await controller.login(input);
    access_token = result.access_token;
    expect(result.username).toBe(input.username);
    expect(result.access_token).toBeDefined();
  });

  it('tests verify method', async () => {
    const req = {
      headers: {
        authorization: 'Bearer ' + access_token,
      },
    } as any;
    const res = {
      set: jest.fn(() => ({ json: jest.fn() })),
    } as any;
    const result = await controller.verify(req, res);
    expect(result).toBe(undefined);
  });
});
