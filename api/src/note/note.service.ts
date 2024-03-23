import { BadRequestException, Injectable } from '@nestjs/common';
import { Note } from './note.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/user.entity';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private repository: Repository<Note>,
  ) {}

  public async create(
    { content }: Partial<Note>,
    { user_id }: Pick<User, 'user_id' | 'username'>,
  ): Promise<Note> {
    if (content.length > 300)
      throw new BadRequestException('Max length is 300');
    if (content.length < 20) throw new BadRequestException('Min length is 20');
    return this.repository.save(
      this.repository.create({
        content,
        user_id,
      }),
    );
  }

  public async search(
    query: string = '',
    { user_id }: Pick<User, 'user_id' | 'username'>,
  ): Promise<{ notes: Note[] }> {
    const notes = await this.repository
      .createQueryBuilder('note')
      .where('note.user_id = :user_id', { user_id })
      .andWhere('note.content LIKE :query', { query: `%${query}%` })
      .getMany();
    return {
      notes,
    };
  }
}
