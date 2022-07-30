import { UserEntity } from 'src/users/user.entity';
import { ICreateUserMessage } from 'src/utils/types/error.interface';
import { Connection } from 'typeorm';

export async function saveWithQueryRunner(
  connection: Connection,
  user: UserEntity,
): Promise<ICreateUserMessage> {
  const queryRunner = connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  let result: ICreateUserMessage = {
    successMessage: `Create ${user.username}'s Identity Successfully!`,
  };
  try {
    await queryRunner.manager.save(user);
    await queryRunner.commitTransaction();
  } catch (e) {
    // 에러가 발생하면 롤백
    await queryRunner.rollbackTransaction();
    result = { errorMessage: e.message };
  } finally {
    // 직접 생성한 QueryRunner는 해제시켜 주어야 함
    await queryRunner.release();
    if (result.errorMessage) {
      return result;
    }
  }
}
