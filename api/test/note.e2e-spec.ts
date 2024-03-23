import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app/app.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/auth/user.entity';
import { Note } from '../src/note/note.entity';
import { AuthModule } from '../src/auth/auth.module';
import { NoteModule } from '../src/note/note.module';

const path = require('path');

describe('AdminController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          global: true,
          secret: 'XXXXXXXXXXXXXX',
          signOptions: { expiresIn: '999s' },
        }),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: path.resolve(__dirname, 'data/db.service.test.sq3'),
          entities: [User, Note],
          synchronize: true,
          dropSchema: true,
        }),
        AuthModule,
        NoteModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/note/create (POST) 401 expected', () => {
    return request(app.getHttpServer()).post('/note/create').expect(401);
  });

  function create(
    content,
    access_token,
  ): Promise<{
    body: { note_id: string; content: string; user_id: string };
    status: number;
  }> {
    return request(app.getHttpServer())
      .post('/note/create')
      .set('Authorization', 'Bearer ' + access_token)
      .send({ content });
  }

  function register(): Promise<{
    body: { access_token: string; username: string };
    status: number;
  }> {
    return request(app.getHttpServer()).post('/auth/register').send({
      username: 'steve',
      password: 'password',
    });
  }
  it('/auth/register (POST)', async () => {
    const response = await register();
    expect(response.body).toEqual({
      access_token: expect.any(String),
      username: 'steve',
    });
    expect(response.status).toBe(200);
  });

  it('/note/create (POST) with access_token', async () => {
    const {
      body: { access_token },
    } = await register();
    const response = await create('This is the test note', access_token);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      note_id: expect.any(String),
      user_id: expect.any(String),
      content: 'This is the test note',
    });
  });

  it('/note/create (POST) validates max length', async () => {
    const {
      body: { access_token },
    } = await register();
    const content = new Array(301).fill('A').join('');
    const response = await create(content, access_token);
    expect(response.status).toBe(400);
  });

  it('/note/create (POST) validates min length', async () => {
    const {
      body: { access_token },
    } = await register();
    const content = new Array(19).fill('A').join('');
    const response = await create(content, access_token);
    expect(response.status).toBe(400);
  });

  it('/note/search (GET) empty query returns all', async () => {
    const {
      body: { access_token },
    } = await register();
    await create('The light of a candle', access_token);
    await create('Is transferred to another candle', access_token);
    await create('Spring twilight_____', access_token);
    const response = await request(app.getHttpServer())
      .post('/note/search')
      .set('Authorization', 'Bearer ' + access_token);
    expect(response.status).toBe(201);
    expect(response.body.notes.length).toBe(3);
  });

  it('/note/search (GET) returns matches', async () => {
    const {
      body: { access_token },
    } = await register();
    await create('The light of a candle', access_token);
    await create('Is transferred to another candle', access_token);
    await create('Spring twilight_____', access_token);
    const query = 'candle';
    const response = await request(app.getHttpServer())
      .post('/note/search?q=' + query)
      .set('Authorization', 'Bearer ' + access_token);
    expect(response.status).toBe(201);
    expect(response.body.notes.length).toBe(2);
  });
});
