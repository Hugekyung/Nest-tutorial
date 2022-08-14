import { ICreateUserMessage } from 'src/utils/types/error.interface';
import { Connection } from 'typeorm';

export async function saveDataWithQueryRunner(
  connection: Connection,
  data,
): Promise<ICreateUserMessage> {
  const queryRunner = connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  let result: ICreateUserMessage = {
    successMessage: 'Create Items Successfully!',
  };
  try {
    await queryRunner.manager.save(data);
    await queryRunner.commitTransaction();
  } catch (e) {
    // 에러가 발생하면 롤백
    await queryRunner.rollbackTransaction();
    result = { errorMessage: e.message };
  } finally {
    // 직접 생성한 QueryRunner는 해제시켜 주어야 함
    await queryRunner.release();
    return result;
  }
}
