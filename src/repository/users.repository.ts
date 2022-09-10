import { User } from '../users/user.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findAll() {
    return await this.find();
  }

  async findUserById(userId: number) {
    return await this.findOne(userId);
  }

  async findUserByName(username: string) {
    return await this.findOne(username);
  }

  async findUserByEmail(email: string) {
    return await this.findOne(email);
  }

  async removeUser(user: User) {
    return await this.remove(user);
  }
}
