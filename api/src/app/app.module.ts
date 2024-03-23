import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerminusModule } from '@nestjs/terminus';
import { dataPath } from './dataPath';
import { User } from '../auth/user.entity';
import { Note } from '../note/note.entity';
import { AuthModule } from '../auth/auth.module';
import { NoteModule } from '../note/note.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: dataPath('db.sq3'),
      entities: [User, Note],
      synchronize: true,
    }),
    TerminusModule,
    AuthModule,
    NoteModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
