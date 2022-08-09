import { Post } from 'src/posts/post.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('User')
@Unique(['username', 'email'])
export class User {
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

  @OneToMany(() => Post, (posts) => posts.user)
  posts: Post[];
}
