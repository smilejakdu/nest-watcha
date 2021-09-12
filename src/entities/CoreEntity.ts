import { IsString } from 'class-validator';
import {
	DeleteDateColumn,
	UpdateDateColumn,
	CreateDateColumn,
	Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('id', ['id'], { unique: true })
export class CoreEntity {
	@PrimaryGeneratedColumn({ type: 'int', name: 'id' })
	id: number;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@DeleteDateColumn()
	deletedAt: Date | null;
}
