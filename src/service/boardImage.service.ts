import { isNil } from 'lodash';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardImageRepository } from '../database/repository/BoardRepository/boardImage.repository';
import {CoreResponseDto, SuccessFulResponse} from '../shared/CoreResponse';
import {BoardImageEntity} from "../database/entities/Board/BoardImage.entity";
import {transactionRunner} from "../shared/common/transaction/transaction";
import {DataSource, QueryRunner} from "typeorm";

@Injectable()
export class BoardImageService {
	constructor(
		private readonly boardImageRepository : BoardImageRepository,
		private readonly dataSource: DataSource,
	) {}

	async uploadFiles(files) {
		const uploadedFile = await this.boardImageRepository.uploadFiles(files);
		if(!isNil(uploadedFile)){
			throw new NotFoundException(`does not found ${uploadedFile}`);
		}
		return SuccessFulResponse(uploadedFile);
	}

	async findAllImages(): Promise<CoreResponseDto> {
		const foundAllImage = await this.boardImageRepository.findAllImages();

		if(!foundAllImage) {
			throw new NotFoundException(`does not found ${foundAllImage}`);
		}

		return SuccessFulResponse(foundAllImage);
	}

	async saveBoardImages(images: string[], boardId: number) {
		if (!images?.length) return null;

		return await Promise.all(images.map(async (image) => {
			const boardImage = new BoardImageEntity();
			boardImage.board_id = boardId;
			boardImage.imagePath = image;
			return await transactionRunner(async (queryRunner: QueryRunner) => {
				return await queryRunner.manager.save(BoardImageEntity, boardImage);
			}, this.dataSource);
		}));
	}
}
