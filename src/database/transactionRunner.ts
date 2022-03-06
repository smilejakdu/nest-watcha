import { getConnection, QueryRunner } from 'typeorm';

export async function transactionRunner(
  connectionName: string,
  queryFunction: (queryRunner: QueryRunner) => Promise<void>,
  errorHandler?: (err: Error) => Promise<void>,
): Promise<boolean> {
  let isSuccessed = true;
  const queryRunner = getConnection(connectionName).createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  console.log('transaction start');
  try {
    await queryFunction(queryRunner);
    await queryRunner.commitTransaction();
    if (!queryRunner.isReleased) {
      await queryRunner.release();
    }
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
      await errorHandler(err);
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
  connectionName: 'nest_watcha',
  queryFunction: (queryRunner: QueryRunner) => Promise<any>,
  parentQueryRunner?: QueryRunner,
  errorHandler?: (err: Error) => Promise<void>,
): Promise<any> {
  let queryRunner = parentQueryRunner;
  let result: any;
  let needRelease = false;
  if (!parentQueryRunner) {
    queryRunner = getConnection(connectionName).createQueryRunner();
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
      await errorHandler(err);
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
