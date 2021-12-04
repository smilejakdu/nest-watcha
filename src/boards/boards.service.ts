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
		const foundByNickname: Users = await this.usersRepository
			.createQueryBuilder('user')
			.where('user.nickname =:nickname', { nickname })
			.execute();

		return foundByNickname;
	}

	async findAllBoards(): Promise<Boards[]> {
		const foundAllBoards: Boards[] = await this.boardsRepository
			.createQueryBuilder('boards')
			.leftJoin('boards.User', 'user')
			.getMany();

		return foundAllBoards;
	}

	async findMyBoard(userId: number): Promise<[Boards[], number]> {
		const foundMyBoardResponse: [Boards[], number] = await this.boardsRepository
			.createQueryBuilder('boards')
			.leftJoinAndSelect('boards.User', 'user')
			.where('boards.userId =:userId', { userId })
			.getManyAndCount();

		return foundMyBoardResponse;
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
		const board: Boards = await this.boardsRepository
			.createQueryBuilder('board')
			.where('board.boardId =:boardId', { boardId })
			.getOne();

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
		return await this.boardsRepository
			.createQueryBuilder('board')
			.delete()
			.where('board.boardId =:boardId', { boardId })
			.execute();
	}
}
