import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Note {
  @PrimaryGeneratedColumn('uuid')
  note_id: string;

  @Column({ nullable: true })
  user_id?: string;

  @Column({ nullable: true })
  content?: string;
}
