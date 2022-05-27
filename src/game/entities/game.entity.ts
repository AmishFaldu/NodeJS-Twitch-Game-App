import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';

@Entity({ name: 'game' })
@Index(['name', 'igdbGameId']) // Reads from DB becomes faster when indexing name and igdbGameId columns
@Index(['user']) // Reads for favourite game will be faster using indexing
@Unique(['igdbGameId']) // Unique constraint for igdbGameId. We don't want to store multiple games with same game id.
export class GameEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  igdbGameId: string;

  @ManyToOne(() => UserEntity, (user) => user.favouriteGames)
  user: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
