import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { log } from 'console';
import { BoardHashTag } from 'src/entities/BoardHashTag';
import { Boards } from 'src/entities/Boards';
import { HashTag } from 'src/entities/HashTag';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';

// @Injectable() 데코레이터는 BoardsService 클래스를 
@Injectable() 
export class BoardsService {
	constructor(
		@InjectRepository(Boards) private boardsRepository: Repository<Boards>,
		@InjectRepository(HashTag) private hashTagRepository: Repository<HashTag>,
		@InjectRepository(BoardHashTag) private boardHashTagRepository: Repository<BoardHashTag>,
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
		.leftJoin('boards.User' , 'user')
		.getMany();
		return board
	}

	async findMyBoard(UserId: number) : Promise<object> {
		return this.boardsRepository.createQueryBuilder('boards')
		.leftJoinAndSelect('boards.User' , 'user')
		.where('boards.UserId = :UserId', { UserId: UserId })
		.getMany();
	}

	async createBoard(title: string, content: string, hashtag:string, UserId: number) {
		const hashtags : string[] = hashtag.match(/#[^\s#]+/g);
		const hashId : number[] = [];
		if(hashtags.length > 0){
			const HashSliceLowcase = hashtags.map(v => v.slice(1).toLowerCase());
			for(let i = 0; i < HashSliceLowcase.length; i++){
				const result = this.hashTagRepository.findOne({
					where: {hash : HashSliceLowcase[i]}
				}) 

				if (!(await result)){
					const hashTag = this.hashTagRepository.createQueryBuilder('hashtag')	
						.insert()
						.values([
							{hash:HashSliceLowcase[i]}
						])
						.execute()
						hashId.push((await hashTag).identifiers[0].id)
				}else{
						hashId.push((await result).id)
				}
			}
		}
		const boards = this.boardsRepository.createQueryBuilder('boards')
			.insert()
			.values([
				{title : title , content : content ,imagePath : "" , UserId : UserId}
			])
			.execute();
		const boardId = (await boards).identifiers[0].id;
		
		for(let hash of hashId){
			this.boardHashTagRepository.createQueryBuilder('boardHashTag')
				.insert()
				.values([
					{BoardId :boardId ,  HashId : hash}
				])
				.execute();
		}
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
