import { Connection, getConnection, QueryRunner, DataSource } from 'typeorm';

export async function transactionRunner(
  queryFunction: (queryRunner: QueryRunner) => Promise<void>,
  dataSource?: DataSource,
  errorHandler?: (err: Error) => Promise<void>,
): Promise<boolean> {
  let isSuccessed = true;
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  console.log('transaction start');
  try {
    await queryFunction(queryRunner);
    await queryRunner.commitTransaction();
    if (!queryRunner.isReleased) {
      await queryRunner.release();
    }
    console.log(queryRunner);
    isSuccessed = true;

    //return isSuccessed; // add
  } catch (err) {
    console.log(err);
    if (!queryRunner.isReleased) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }
      await queryRunner.release();
    }
    if (errorHandler) {
      await errorHandler(err as Error);
    }
    isSuccessed = false;
    throw err;
  } finally {
    if (!queryRunner.isReleased) {
      await queryRunner.release();
    }
  }
  return isSuccessed;
}

export async function queryRunnerManager(
  queryFunction: (queryRunner: QueryRunner) => Promise<any>,
  parentQueryRunner?: QueryRunner,
  errorHandler?: (err: Error) => Promise<void>,
): Promise<any> {
  const connection:Connection = getConnection();
  let queryRunner = parentQueryRunner;
  let result: any;
  let needRelease = false;
  if (!parentQueryRunner) {
    queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    needRelease = true;
  }
  try {
    result = await queryFunction(queryRunner);
  } catch (err) {
    if (needRelease && !queryRunner.isReleased) {
      await queryRunner.release();
    }
    if (errorHandler) {
      await errorHandler(err as Error);
    } else {
      throw err;
    }
  } finally {
    if (needRelease && !queryRunner.isReleased) {
      await queryRunner.release();
    }
  }
  return result;
}
