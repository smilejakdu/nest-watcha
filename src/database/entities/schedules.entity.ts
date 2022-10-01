import { ApiProperty } from '@nestjs/swagger';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CoreEntity } from './core.entity';
import { UsersEntity } from './User/Users.entity';

@Entity({ schema: 'nest_watcha', name: 'schedules' })
export class SchedulesEntity extends CoreEntity {
	@Column('varchar', { name: 'title', length: 100 })
	title: string;

	@Column('varchar', { name: 'genre', length: 100 })
	genre: string;

	@Column('int', { name: 'userId', nullable: true })
	userId: number | null;

	@ManyToOne(() => UsersEntity, users => users.Schedules, {
		onDelete: 'SET NULL',
		onUpdate: 'CASCADE',
	})
	@JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
	User: UsersEntity;
}
