import { size, isEmpty } from 'lodash';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardHashTag } from 'src/entities/BoardHashTag';
import { Boards } from 'src/entities/Boards';
import { HashTag } from 'src/entities/HashTag';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';
import { BoardImage } from '../entities/BoardImage';
import { log } from 'console';

@Injectable()
export class BoardsService {
	constructor(
		@InjectRepository(Boards) private boardsRepository: Repository<Boards>,
		@InjectRepository(BoardImage) private boardImageRepository: Repository<BoardImage>,
		@InjectRepository(HashTag) private hashTagRepository: Repository<HashTag>,
		@InjectRepository(BoardHashTag)
		private boardHashTagRepository: Repository<BoardHashTag>,
		@InjectRepository(Users) private usersRepository: Repository<Users>,
	) {}

	async findByNickname(nickname: string): Promise<object> {
		const findByNicknameResult: Users = await this.usersRepository.findOne({
			where: { nickname },
			select: ['id', 'nickname'],
		});
		return findByNicknameResult;
	}

	async findAllBoards(): Promise<object> {
		let board = await this.boardsRepository.createQueryBuilder('boards').leftJoin('boards.User', 'user').getMany();
		return board;
	}

	async findMyBoard(UserId: number): Promise<object> {
		const findMyBoardResult = await this.boardsRepository
			.createQueryBuilder('boards')
			.leftJoinAndSelect('boards.User', 'user')
			.where('boards.UserId = :UserId', { UserId: UserId })
			.getManyAndCount();
		return findMyBoardResult;
	}

	async insertHashtagList(hashTagList) {
		const hashtagInsertedList = await this.hashTagRepository
			.createQueryBuilder('hashtag')
			.insert()
			.values(hashTagList)
			.execute();
		return hashtagInsertedList;
	}

	async createBoard(title: string, content: string, UserId: number) {
		const boards = await this.boardsRepository
			.createQueryBuilder('boards')
			.insert()
			.values([{ title: title, content: content, UserId: UserId }])
			.execute();

		return boards.identifiers[0].id;
	}

	async updateBoard(BoardId: number, title: string, content: string) {
		const board: Boards = await this.boardsRepository.findOne({ where: { BoardId } });
		await this.boardsRepository
			.createQueryBuilder('board')
			.update<Boards>(Boards, {
				id: board.id,
				title: title,
				content: content,
			})
			.where('board.id = :id', { id: board.id })
			.execute();
	}

	async deleteBoardOne(BoardId: number) {
		const deleteResult = await this.boardsRepository.delete(BoardId);
		return deleteResult;
	}
}
