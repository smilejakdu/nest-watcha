import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { CoreEntity } from './CoreEntity';
import { Users } from './Users';

@Index('id', ['id'], { unique: true })
@Entity({ schema: 'nest_watcha', name: 'schedules' })
export class Schedules extends CoreEntity {
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
		example: 'genre',
		description: 'genre',
	})
	@Column('varchar', { name: 'genre', length: 100 })
	genre: string;

	@Column('int', { name: 'UserId', nullable: true })
	UserId: number | null;

	@ManyToOne(() => Users, users => users.UserToSchedules, {
		onDelete: 'SET NULL',
		onUpdate: 'CASCADE',
	})
	@JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }])
	User: Users;
}
