import { Post } from '../posts/post.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  async findAll() {
    return await this.find();
  }
}
