import { QueryRunner, DataSource } from 'typeorm';

export type TFunctionTransction = (queryRunner: QueryRunner) => any;

export async function transactionRunner(
  transactionFunction: TFunctionTransction,
  dataSource?: DataSource,
) {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  let transactionResult: any;
  try {
    transactionResult = await transactionFunction(queryRunner);
    await queryRunner.commitTransaction();
  } catch (error) {
    console.error(error);
    await queryRunner.rollbackTransaction();
    if (!queryRunner.isReleased) {
      await queryRunner.release();
    }
    throw error;
  } finally {
    if (!queryRunner.isReleased) {
      await queryRunner.release();
    }
  }
  return transactionResult;
}
