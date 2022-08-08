import { UserEntity } from '../users/user.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository()
export class UserRepository extends Repository<UserEntity> {}
