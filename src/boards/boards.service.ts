import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Boards } from 'src/entities/Boards';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';

@Injectable()
export class BoardsService {
	constructor(
		@InjectRepository(Boards) private boardsRepository: Repository<Boards>,
		@InjectRepository(Users) private usersRepository: Repository<Users>,
	) {}

	async findByNickname(nickname: string) {
		return this.usersRepository.findOne({
			where: { nickname },
			select: ['id', 'nickname'],
		});
	}

	async findMyBoard(UserId: number) {
		return this.boardsRepository.find({
			where: {
				WorkspaceMembers: [{ userId: UserId }],
			},
		});
	}

	async createBoard(title: string, content: string, UserId: number) {
		console.log(title, content, UserId);
		const boards = new Boards();

		boards.title = title;
		boards.content = content;
		boards.UserId = UserId;
		await this.boardsRepository.save(boards);
	}

	async updateBoard(BoardId: number, title: string, content: string) {
		console.log(BoardId, title, content);
		const board = await this.boardsRepository.findOne({ where: { BoardId } });

		board.id = board.id;
		board.title = title;
		board.content = content;

		await this.boardsRepository.save(board);
	}

	async deleteBoardOne(BoardId: number) {
		console.log(BoardId);
		const boards = new Boards();
		boards.id = BoardId;
		// 이렇게 객체를 전부 넣어야하는걸까요 ??
		// interger 만 넣고 하는방법이 없을까 ? --> delete
		/*
				remove(entities: Entity[], options?: RemoveOptions): Promise<Entity[]>;
				remove(entity: Entity, options?: RemoveOptions): Promise<Entity>;
		 */
		// await this.boardsRepository.remove(boards); --> 객체 넣어야하는게 너무.. 이상한데.??
		// --> delete 하면됨
		const test = await this.boardsRepository.delete(BoardId);
	}
}
