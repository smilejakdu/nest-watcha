import { EntityRepository, QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';
import { BoardImageEntity } from '../entities/BoardImage.entity';
import { createImageURL } from '../../shared/lib/multerOptions';
import { isNil } from 'lodash';

@EntityRepository(BoardImageEntity)
export class BoardImageRepository extends Repository<BoardImageEntity> {
  makeQueryBuilder(queryRunner?: QueryRunner): SelectQueryBuilder<BoardImageEntity> {
    return this.createQueryBuilder('board_images', queryRunner);
  }

  async uploadFiles(files: File[]):Promise<string[]> {
    const generatedFiles: string[] = [];
    for (const file of files) {
      generatedFiles.push(createImageURL(file));
    }
    return generatedFiles;
  }

  async findAllImages(): Promise<any> {
    return await this.makeQueryBuilder()
      .select('board_images.imagePath')
      .getMany();
  }

  async insertImages(boardId: number, imagePathList: string[]) {
    const insertImagePathResult: any[] = [];
    if (!isNil(imagePathList)) {
      for (const imagePath of imagePathList) {
        insertImagePathResult.push({ BoardId: boardId, imagePath: imagePath });
      }
      const result = await this.makeQueryBuilder()
        .insert()
        .values(insertImagePathResult)
        .execute();

      return result.raw.insertId;
    }
  }
}
