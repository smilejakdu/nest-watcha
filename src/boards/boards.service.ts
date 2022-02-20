import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardsEntity } from 'src/entities/BoardsEntity';
import { HashTagEntity } from 'src/entities/HashTagEntity';
import { UsersEntity } from 'src/entities/UsersEntity';
import { Repository } from 'typeorm';

@Injectable()
export class BoardsService {
	constructor(
		@InjectRepository(BoardsEntity) private boardsRepository: Repository<BoardsEntity>,
		@InjectRepository(HashTagEntity) private hashTagRepository: Repository<HashTagEntity>,
		@InjectRepository(UsersEntity) private usersRepository: Repository<UsersEntity>,
	) {}

	async findByNickname(nickname: string): Promise<object> {
		const foundByNickname: UsersEntity = await this.usersRepository.createQueryBuilder('user').where('user.nickname =:nickname', { nickname }).execute();
		return foundByNickname;
	}

	async findAllBoards(): Promise<BoardsEntity[]> {
		const foundAllBoards: BoardsEntity[] = await this.boardsRepository.createQueryBuilder('boards').leftJoin('boards.User', 'user').getMany();
		return foundAllBoards;
	}

	async findMyBoard(userId: number): Promise<[BoardsEntity[], number]> {
		const foundMyBoardResponse: [BoardsEntity[], number] = await this.boardsRepository
			.createQueryBuilder('boards')
			.leftJoinAndSelect('boards.User', 'user')
			.where('boards.userId =:userId', { userId })
			.getManyAndCount();
		return foundMyBoardResponse;
	}

	async insertHashtagList(hashTagList) {
		const hashtagInsertedList = await this.hashTagRepository.createQueryBuilder('hashtag').insert().values(hashTagList).execute();

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
		const board: BoardsEntity = await this.boardsRepository.createQueryBuilder('board').where('board.boardId =:boardId', { boardId }).getOne();

		await this.boardsRepository
			.createQueryBuilder('board')
			.update<BoardsEntity>(BoardsEntity, {
				id: board.id,
				title: title,
				content: content,
			})
			.where('board.id = :id', { id: board.id })
			.execute();
	}

	async deleteBoardOne(boardId: number) {
		return await this.boardsRepository.createQueryBuilder('board').delete().where('board.boardId =:boardId', { boardId }).execute();
	}
}
