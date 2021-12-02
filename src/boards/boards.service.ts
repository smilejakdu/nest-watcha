import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Boards } from 'src/entities/Boards';
import { HashTag } from 'src/entities/HashTag';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';

@Injectable()
export class BoardsService {
	constructor(
		@InjectRepository(Boards) private boardsRepository: Repository<Boards>,
		@InjectRepository(HashTag) private hashTagRepository: Repository<HashTag>,
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

	async findMyBoard(userId: number): Promise<object> {
		const findMyBoardResult = await this.boardsRepository
			.createQueryBuilder('boards')
			.leftJoinAndSelect('boards.User', 'user')
			.where('boards.userId = :userId', { userId })
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

	async createBoard(title: string, content: string, userId: number) {
		const boards = await this.boardsRepository
			.createQueryBuilder('boards')
			.insert()
			.values([{ title: title, content: content, userId: userId }])
			.execute();

		return boards.identifiers[0].id;
	}

	async updateBoard(boardId: number, title: string, content: string) {
		const board: Boards = await this.boardsRepository.findOne({ where: { boardId } });
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

	async deleteBoardOne(boardId: number) {
		const deleteResult = await this.boardsRepository.delete(boardId);
		return deleteResult;
	}
}
