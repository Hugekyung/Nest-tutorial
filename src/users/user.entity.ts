import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('User')
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
