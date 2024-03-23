import {
  Body,
  Controller,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { NoteService } from './note.service';
import { Note } from './note.entity';
import { User } from 'src/auth/user.entity';

@Controller('/note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @UseGuards(AuthGuard)
  @Post('/create')
  create(
    @Body() note: Partial<Note>,
    @Request() req: Request & { user: Pick<User, 'user_id' | 'username'> },
  ) {
    return this.noteService.create(note, req.user);
  }

  @UseGuards(AuthGuard)
  @Post('/search')
  search(
    @Query('q') query: string,
    @Request() req: Request & { user: Pick<User, 'user_id' | 'username'> },
  ) {
    return this.noteService.search(query, req.user);
  }
}
