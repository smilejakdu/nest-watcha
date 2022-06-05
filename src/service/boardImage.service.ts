import { isNil } from 'lodash';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BoardImageRepository } from '../database/repository/boardImage.repository';
import { SuccessFulResponse} from '../shared/CoreResponse';

@Injectable()
export class BoardImageService {
	constructor(
		private readonly boardImageRepository : BoardImageRepository) {}


	async uploadFiles(files) {
		const uploadedFile = await this.boardImageRepository.uploadFiles(files);
		if(!isNil(uploadedFile)){
			throw new NotFoundException(`does not found ${uploadedFile}`);
		}
		return SuccessFulResponse(uploadedFile);
	}

	async findAllImages(): Promise<any> {
		const foundAllImage = await this.boardImageRepository.findAllImages();
		if(!isNil(foundAllImage)){
			throw new NotFoundException(`does not found ${foundAllImage}`);
		}
		return SuccessFulResponse(foundAllImage);
	}

	async insertImages(boardId: number, imagePathList: string[]) {
		const responseInsertImages = await this.boardImageRepository.insertImages(boardId,imagePathList);
		if(!isNil(responseInsertImages)){
			throw new BadRequestException('BAD REQUEST');
		}
		return SuccessFulResponse(responseInsertImages);
	}
}
