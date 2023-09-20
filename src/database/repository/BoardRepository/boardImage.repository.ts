import {QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';
import { BoardImageEntity } from '../../entities/Board/BoardImage.entity';
import { createImageURL } from '../../../shared/lib/multerOptions';
import { isNil } from 'lodash';
import {CustomRepository} from "../../../shared/typeorm/typeorm-ex.decorator";

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

	async findAllImages() {
    return this.makeQueryBuilder()
      .select('board_images.imagePath')
			.addSelect([
				'board.id',
				'board.title',
				'board.content',
			])
			.addSelect([
				'user.id',
				'user.username',
				'user.email',
			])
			.innerJoin('board_images.board', 'board')
			.innerJoin('board.User', 'user')
			.getMany();
	}

	async deleteImage(board_id: number) {
		return this.makeQueryBuilder()
			.delete()
			.where('board_id = :board_id', { board_id: board_id })
			.execute();
	}

	findBoardImage() {
		return this.makeQueryBuilder()
			.select('board_images.imagePath')
			.addSelect([
				'Board.boardId',
				'board_images.imageId',
			])
			.innerJoin('board_images.Board', 'Board')
			.getMany();
	}

	async insertImages(boardId: number, imagePathList: string[]) {
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
