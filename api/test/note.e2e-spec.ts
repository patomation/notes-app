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
import { AuthService } from 'src/auth/auth.service';

const path = require('path');

describe('AdminController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        NoteModule,
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
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/note/create (POST) 401 expected', () => {
    return request(app.getHttpServer()).post('/note/create').expect(401);
  });

  function createNote(
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

  function updateNote(
    note_id,
    content,
    access_token,
  ): Promise<{
    body: { note_id: string; content: string; user_id: string };
    status: number;
  }> {
    return request(app.getHttpServer())
      .patch('/note/' + note_id)
      .set('Authorization', 'Bearer ' + access_token)
      .send({ content });
  }

  function deleteNote(
    note_id,
    access_token,
  ): Promise<{
    body: { note_id: string; content: string; user_id: string };
    status: number;
  }> {
    return request(app.getHttpServer())
      .delete('/note/' + note_id)
      .set('Authorization', 'Bearer ' + access_token)
      .send();
  }

  function allNotes(access_token) {
    return request(app.getHttpServer())
      .post('/note/search')
      .set('Authorization', 'Bearer ' + access_token);
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
    const response = await createNote('This is the test note', access_token);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      note_id: expect.any(String),
      user_id: expect.any(String),
      deleted_at: null,
      content: 'This is the test note',
    });
  });

  it('/note/:note_id (PATCH)', async () => {
    const {
      body: { access_token },
    } = await register();
    const contentA = 'This is the old note';
    const contentB = 'This is the UPDATED note';
    const responseA = await createNote(contentA, access_token);
    const { note_id } = responseA.body;
    const responseB = await updateNote(note_id, contentB, access_token);
    expect(responseB.body.content).toBe(contentB);
    const searchResponse = await request(app.getHttpServer())
      .post('/note/search')
      .set('Authorization', 'Bearer ' + access_token);
    expect(searchResponse.body.notes[0].content).toBe(contentB);
  });

  it('/note/:note_id (DELETE)', async () => {
    const {
      body: { access_token },
    } = await register();
    const responseA = await createNote('Note A _____________', access_token);
    const responseB = await createNote('Note B _____________', access_token);
    const searchResponseA = await allNotes(access_token);
    expect(searchResponseA.body.notes.length).toBe(2);
    const delteReponse = await deleteNote(responseB.body.note_id, access_token);
    expect(delteReponse.status).toBe(200);
    const searchResponseB = await allNotes(access_token);
    expect(searchResponseB.body.notes.length).toBe(1);
  });

  it('/note/create (POST) validates max length', async () => {
    const {
      body: { access_token },
    } = await register();
    const content = new Array(301).fill('A').join('');
    const response = await createNote(content, access_token);
    expect(response.status).toBe(400);
  });

  it('/note/create (POST) validates min length', async () => {
    const {
      body: { access_token },
    } = await register();
    const content = new Array(19).fill('A').join('');
    const response = await createNote(content, access_token);
    expect(response.status).toBe(400);
  });

  it('/note/search (GET) empty query returns all', async () => {
    const {
      body: { access_token },
    } = await register();
    await createNote('The light of a candle', access_token);
    await createNote('Is transferred to another candle', access_token);
    await createNote('Spring twilight_____', access_token);
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
    await createNote('The light of a candle', access_token);
    await createNote('Is transferred to another candle', access_token);
    await createNote('Spring twilight_____', access_token);
    const query = 'candle';
    const response = await request(app.getHttpServer())
      .post('/note/search?q=' + query)
      .set('Authorization', 'Bearer ' + access_token);
    expect(response.status).toBe(201);
    expect(response.body.notes.length).toBe(2);
  });
});
