import { isNil } from 'lodash';
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
		console.log('foundAllImage:',foundAllImage);
		return {
			ok: !isNil(foundAllImage),
			statusCode :!isNil(foundAllImage) ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST,
			message: !isNil(foundAllImage) ?'SUCCESS': 'BAD_REQUEST',
			data:!isNil(foundAllImage) ? foundAllImage : null,
		};
	}

	async insertImages(boardId: number, imagePathList: string[]) {
		const responseInsertImages = await this.boardImageRepository.insertImages(boardId,imagePathList);
		return {
			ok: !isNil(responseInsertImages),
			statusCode :!isNil(responseInsertImages) ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST,
			message: !isNil(responseInsertImages) ?'SUCCESS': 'BAD_REQUEST',
			data:!isNil(responseInsertImages) ? responseInsertImages : [],
		};
	}
}
