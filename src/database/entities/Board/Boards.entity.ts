import {Column, Entity, JoinColumn, ManyToOne, OneToMany, QueryRunner} from 'typeorm';
import { CommentsEntity } from '../comments/comments.entity';
import { CoreEntity } from '../core.entity';
import { UsersEntity } from '../User/Users.entity';
import { BoardImageEntity } from './BoardImage.entity';
import { BoardHashTagEntity } from './BoardHashTag.entity';
import {transactionRunner} from "../../../shared/common/transaction/transaction";
import {NotFoundException} from "@nestjs/common";
import {SuccessFulResponse} from "../../../shared/CoreResponse";

@Entity({ schema: 'nest_watcha', name: 'boards' })
export class BoardsEntity extends CoreEntity {
	@Column('varchar', { name: 'title', length: 100 })
	title: string;

	@Column('varchar', { name: 'content', length: 500 })
	content: string;

	@Column('int', { name: 'user_id', nullable: true })
	user_id: number | null;

	@ManyToOne(() => UsersEntity, users => users.Boards, {
		onDelete: 'SET NULL',
		onUpdate: 'CASCADE',
	})
	@JoinColumn({ name: 'user_id' })
	User: UsersEntity;

	@OneToMany(
		() => BoardImageEntity,
			boardImage => boardImage.board
	)
	boardImages: BoardImageEntity[];

	@OneToMany(
		() => CommentsEntity,
			comments => comments.Board
	)
	comments: CommentsEntity[];

	@OneToMany(
		() => BoardHashTagEntity,
			boardHashTag => boardHashTag.boards
	)
	boardHashTag: BoardHashTagEntity[];

	static makeQueryBuilder(queryRunner?: QueryRunner) {
		if (queryRunner) {
			return queryRunner.manager.createQueryBuilder(BoardsEntity, 'boards');
		} else {
			return this.createQueryBuilder('boards');
		}
	}

	static async saveBoard(boardData, userId: number): Promise<BoardsEntity> {
		const newBoard = new BoardsEntity();
		Object.assign(newBoard, boardData);
		newBoard.user_id = userId;

		return await BoardsEntity.save(newBoard);
	}

	static async deleteBoardOne(boardId: number) {
		try {
			const deletedBoard = await BoardsEntity.createQueryBuilder()
				.softDelete()
				.where("id = :id", { id: boardId })
				.execute();

			return SuccessFulResponse(deletedBoard);
		} catch (error) {
			throw new NotFoundException('해당하는 게시판이 없습니다.');
		}
	}
}
