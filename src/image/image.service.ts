import { isEmpty } from 'lodash';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createImageURL } from 'src/lib/multerOptions';
import { Repository } from 'typeorm';
import { BoardImage } from 'src/entities/BoardImage';

@Injectable()
export class ImageService {
	constructor(@InjectRepository(BoardImage) private boardImageRepository: Repository<BoardImage>) {}

	async uploadFiles(files: File[]) {
		const generatedFiles: string[] = [];
		for (const file of files) {
			generatedFiles.push(createImageURL(file));
		}
		return generatedFiles;
	}

	async findAllImages(): Promise<object> {
		let imageResult = await this.boardImageRepository
			.createQueryBuilder('boardImage')
			.select('boardImage.imagePath')
			.getMany();
		return imageResult;
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
