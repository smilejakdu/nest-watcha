import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { log } from 'console';
import { Boards } from 'src/entities/Boards';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';

// @Injectable() 데코레이터는 BoardsService 클래스를 
@Injectable() 
export class BoardsService {
	constructor(
		@InjectRepository(Boards) private boardsRepository: Repository<Boards>,
		@InjectRepository(Users) private usersRepository: Repository<Users>,
	) {}

	async findByNickname(nickname: string):Promise<object> {
		return this.usersRepository.findOne({
			where: { nickname },
			select: ['id', 'nickname'],
		});
	}

	async findAllBoards() : Promise<object>{
		let board =  this.boardsRepository.createQueryBuilder('boards')
		.select('boards.id')
		.leftJoin('boards.User' , 'user')
		.andWhere('boards.title IN (:...title)' ,{title : ['bob_title_1' , 'bob_title_2']})
		.getMany();
		return board
	}

	async findMyBoard(UserId: number) : Promise<object> {
		return this.boardsRepository.createQueryBuilder('boards')
		.leftJoinAndSelect('boards.User' , 'user')
		.where('boards.UserId = :UserId', { UserId: UserId })
		.getMany();
	}

	async createBoard(title: string, content: string, UserId: number) {
		console.log(title, content, UserId);
		const boards = new Boards();

		boards.title = title;
		boards.content = content;
		boards.imagePath = "";
		boards.UserId = UserId;
		await this.boardsRepository.save(boards);
	}

	async updateBoard(BoardId: number, title: string, content: string) {
		console.log(BoardId, title, content);
		const board = await this.boardsRepository.findOne({ where: { BoardId } });

		board.id = board.id;
		board.title = title;
		board.content = content;

		return await this.boardsRepository.save(board);
	}

	async deleteBoardOne(BoardId: number) {
		console.log(BoardId);
		const boards = new Boards();
		boards.id = BoardId;
		const test = await this.boardsRepository.delete(BoardId);
	}
}
