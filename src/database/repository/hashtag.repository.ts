import {QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';
import { HashTagEntity } from '../entities/hashTag.entity';
import {CustomRepository} from "../../shared/typeorm-ex.decorator";

@CustomRepository(HashTagEntity)
export class HashtagRepository extends Repository<HashTagEntity>{
  makeQueryBuilder(queryRunner?: QueryRunner): SelectQueryBuilder<HashTagEntity> {
    return this.createQueryBuilder('hash_tag', queryRunner);
  }

  async findAllImages(): Promise<any> {
    return await this.makeQueryBuilder()
      .select('boardImage.imagePath')
      .getMany();
  }

  async insertHashtagList(hashTagList) {
    const createdHashtagList =  await this.makeQueryBuilder()
      .insert()
      .values(hashTagList)
      .execute();
    return createdHashtagList;
  }

  async findHashTagList(HashSliceLowcase){
     return this.makeQueryBuilder()
      .select(['hashtag.id', 'hashtag.hash'])
      .where('hashtag.hash IN (:...HashSliceLowcase)', { HashSliceLowcase }).getMany();
  }
}