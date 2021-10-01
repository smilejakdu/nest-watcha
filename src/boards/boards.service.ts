import { size } from 'lodash';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardHashTag } from 'src/entities/BoardHashTag';
import { Boards } from 'src/entities/Boards';
import { HashTag } from 'src/entities/HashTag';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';

@Injectable()
export class BoardsService {
	constructor(
		@InjectRepository(Boards) private boardsRepository: Repository<Boards>,
		@InjectRepository(HashTag) private hashTagRepository: Repository<HashTag>,
		@InjectRepository(BoardHashTag)
		private boardHashTagRepository: Repository<BoardHashTag>,
		@InjectRepository(Users) private usersRepository: Repository<Users>,
	) {}

	async findByNickname(nickname: string): Promise<object> {
		const findByNicknameResult:Users = await this.usersRepository.findOne({
			where: { nickname },
			select: ['id', 'nickname'],
		});
		console.log("findByNicknameResult :" , findByNicknameResult);
		return findByNicknameResult;
	}

	async findAllBoards(): Promise<object> {
		let board = await this.boardsRepository
			.createQueryBuilder('boards')
			.leftJoin('boards.User', 'user')
			.getMany();
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

	async createBoard(title: string, content: string, hashtag: string, UserId: number) {
		const hashtags: string[] = hashtag.match(/#[^\s#]+/g);
		const BoardIdhashId: any[] = [];
		const doesNotHash: any[] = [];

		const boards = await this.boardsRepository
			.createQueryBuilder('boards')
			.insert()
			.values([{ title: title, content: content, imagePath: '', UserId: UserId }])
			.execute();
		const boardId = boards.identifiers[0].id;

		if (hashtags.length > 0) {
			const HashSliceLowcase: string[] = hashtags.map((v): string => v.slice(1).toLowerCase());
			const hashResultStringList = await this.hashTagRepository
				.createQueryBuilder('hashtag')
				.select(['hashtag.id', 'hashtag.hash'])
				.where('hashtag.hash IN (:...HashSliceLowcase)', { HashSliceLowcase })
				.getMany();

			hashResultStringList.forEach(function (element, index) {
				if (element[0] === undefined) {
					doesNotHash.push({ hash: HashSliceLowcase[index] });
				} else {
					BoardIdhashId.push({ BoardId: boardId, HashId: element[0].id });
				}
			});

			if (doesNotHash.length > 0) {
				const hashTag = await this.hashTagRepository
					.createQueryBuilder('hashtag')
					.insert()
					.values(doesNotHash)
					.execute();
				for (const hashTagId of hashTag.identifiers) {
					BoardIdhashId.push({ BoardId: boardId, HashId: hashTagId.id });
				}
			}
		}
		await this.boardHashTagRepository
			.createQueryBuilder('boardHashTag')
			.insert()
			.values(BoardIdhashId)
			.execute();
	}

	async updateBoard(BoardId: number, title: string, content: string) {
		const board:Boards = await this.boardsRepository.findOne({ where: { BoardId } });
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
