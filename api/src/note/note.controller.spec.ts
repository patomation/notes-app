import { Test, TestingModule } from '@nestjs/testing';
import { NoteController } from './note.controller';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';

const path = require('path');

describe('NoteController', () => {
  let controller: NoteController;

  beforeEach(async () => {
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
        AuthModule,
      ],
      controllers: [NoteController],
    }).compile();

    controller = module.get<NoteController>(NoteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
