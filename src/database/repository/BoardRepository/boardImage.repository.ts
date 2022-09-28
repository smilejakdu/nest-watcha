import {QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';
import { BoardImageEntity } from '../../entities/Board/BoardImage.entity';
import { createImageURL } from '../../../shared/lib/multerOptions';
import { isNil } from 'lodash';
import {CustomRepository} from "../../../shared/typeorm-ex.decorator";

@CustomRepository(BoardImageEntity)
export class BoardImageRepository extends Repository<BoardImageEntity> {
	makeQueryBuilder(queryRunner?: QueryRunner): SelectQueryBuilder<BoardImageEntity> {
		return this.createQueryBuilder('board_images', queryRunner);
	}

	async uploadFiles(files: File[]): Promise<string[]> {
		const generatedFiles: string[] = [];
		for (const file of files) {
			generatedFiles.push(createImageURL(file));
		}
		return generatedFiles;
	}

	findAllImages() {
    return this.makeQueryBuilder()
      .select('board_images.imagePath');
	}

	findBoardImage() {
		return this.findAllImages().innerJoin('board_images.Board', 'Board').getMany();
	}

	async insertImages(boardId: number, imagePathList: string[]) {
		console.log(boardId);
		const insertImagePathResult = [];
		if (!isNil(imagePathList)) {
			for (const imagePath of imagePathList) {
				insertImagePathResult.push({ boardId: boardId, imagePath: imagePath });
			}
			const result = await this.makeQueryBuilder().insert().values(insertImagePathResult).execute();

			return result.raw.insertId;
		}
	}
}
