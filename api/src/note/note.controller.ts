import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
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
  @Patch(':note_id')
  update(
    @Param('note_id') note_id: string,
    @Body() note: Partial<Note>,
    @Request() req: Request & { user: Pick<User, 'user_id' | 'username'> },
  ) {
    return this.noteService.update(note_id, note, req.user);
  }

  @UseGuards(AuthGuard)
  @Delete(':note_id')
  delete(
    @Param('note_id') note_id: string,
    @Request() req: Request & { user: Pick<User, 'user_id' | 'username'> },
  ) {
    return this.noteService.delete(note_id, req.user);
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
