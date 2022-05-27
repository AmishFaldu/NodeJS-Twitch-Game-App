import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { GameEntity } from '../../game/entities/game.entity';

@Entity({ name: 'user' })
@Index(['email']) // Indeing for faster query on user login
@Unique(['email']) // Email should be unique for each user
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => GameEntity, (game) => game.user)
  favouriteGames: GameEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
