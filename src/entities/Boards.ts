import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
	ManyToMany,
	JoinTable
} from 'typeorm';
import { Comments } from './Comments';
import { CoreEntity } from './CoreEntity';
import { Users } from './Users';
import { HashTag } from './HashTag';

@Entity({ schema: 'nest_watcha', name: 'boards' })
export class Boards extends CoreEntity{
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		example: 'title',
		description: 'title',
	})
	@Column('varchar', { name: 'title', length: 100 })
	title: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		example: 'content',
		description: 'content',
	})
	@Column('varchar', { name: 'content', length: 500 })
	content: string;

	@IsString()
	@ApiProperty({
		example: 'imagePath',
		description: 'imagePath',
	})
	@Column('varchar', { name: 'imagePath', length: 250 })
	imagePath: string;

	@Column('int', { name: 'UserId', nullable: true })
	UserId: number | null;
	
	@IsNotEmpty()
	@ManyToOne(() => Users, users => users.UserToBoards, {
		onDelete: 'SET NULL',
		onUpdate: 'CASCADE',
	})
	@JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }])
	User: Users;

	@OneToMany(() => Comments, comments => comments.Board)
	Comments: Comments[];

  @ManyToMany(() => HashTag, (hashTag) => hashTag.boards)
  @JoinTable({
    name: "boardhashtag",
    joinColumn: {
      name: "BoardId",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "HashId",
      referencedColumnName: "id",
    },
  })
  hashTag: HashTag[];
}
