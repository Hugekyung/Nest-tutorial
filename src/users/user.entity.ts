import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('User')
@Unique(['username', 'email'])
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30 })
  username: string;

  @Column({ length: 60 })
  email: string;

  @Column({ length: 30 })
  password: string;

  @Column({ length: 30 })
  nickname: string;

  @Column({ length: 30 })
  gender: string;

  @Column({ length: 60 })
  signupVerifyToken: string;
}
