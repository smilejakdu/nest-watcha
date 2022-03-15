import { isEmpty, isNil } from 'lodash';
import { HttpStatus, Injectable } from '@nestjs/common';
import { BoardImageRepository } from '../database/repository/boardImage.repository';

@Injectable()
export class BoardImageService {
	constructor(
		private readonly boardImageRepository : BoardImageRepository) {}


	async uploadFiles(files){
		const uploadedFile = await this.boardImageRepository.uploadFiles(files);
		return {
			ok: !isNil(uploadedFile),
			statusCode :!isNil(uploadedFile) ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST,
			message: !isNil(uploadedFile) ?'SUCCESS': 'BAD_REQUEST',
			data:!isNil(uploadedFile) ? uploadedFile : null,
		};
	}

	async findAllImages(): Promise<any> {
		const foundAllImage = await this.boardImageRepository.findAllImages();
		return {
			ok: !isNil(foundAllImage),
			statusCode :!isNil(foundAllImage) ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST,
			message: !isNil(foundAllImage) ?'SUCCESS': 'BAD_REQUEST',
			data:!isNil(foundAllImage) ? foundAllImage : null,
		};
	}

	async insertImages(boardId: number, imagePathList: string[]) {
		const insertImagePathResult: any[] = [];
		if (!isEmpty(imagePathList)) {
			for (const imagePath of imagePathList) {
				insertImagePathResult.push({ BoardId: boardId, imagePath: imagePath });
			}
			await this.boardImageRepository.createQueryBuilder('boardImage').insert().values(insertImagePathResult).execute();
		}
	}
}
