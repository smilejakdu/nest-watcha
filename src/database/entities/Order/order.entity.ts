import { CoreEntity } from '../core.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, QueryRunner } from "typeorm";
import { UsersEntity } from '../User/Users.entity';
import { MovieEntity } from '../MovieAndGenre/movie.entity';

export enum OrderStatus {
	INIT = 'init',
	READY_VBANK = 'ready_vbank',
	ORDER_FULFILLED = 'order_fulfilled',
	PAID = 'paid',
	UNMATCHED = 'unmatched',
	CANCELLED = 'cancelled',
	PURCHASE_DECISION = 'purchase_decision',
	DELETED = 'deleted',
	RETURNED = 'returned',
	EXCHANGED = 'exchanged',
}

export enum IamportPaymentStatus {
	PAID = 'paid', // 결제 완료
	CANCELLED = 'cancelled', // 취소됨
	FAILED = 'failed', // 결제 실패
}

export enum IamportValidateStatus {
	SUCCESS = 'success', // 결제 성공
	VBANKISSUED = 'vbankIssued', // 가상계좌 발급 성공
	CANCELLED = 'cancelled', // 취소됨
	FAILED = 'failed', // 결제 실패
}

@Entity({ schema: 'nest_watcha', name: 'orders' })
export class OrderEntity extends CoreEntity {
	@Column('varchar', { name: 'order_number', length: 250, nullable: true })
	order_number: string;

	@Column('varchar', { name: 'toss_order_number', length: 250, nullable: true })
	toss_order_number: string;

	@Column({
		type: 'enum',
		enum: OrderStatus,
		default: OrderStatus.INIT,
		nullable: false,
		comment: '주문 상태',
	})
	order_status: OrderStatus;

	@Column('int', { name: 'user_id', nullable: true })
	user_id: number | null;

	@Column('int', { name: 'movie_id', nullable: true })
	movie_id: number | null;

	@Column({
		comment: '총 결제 금액',
		default: 0,
		nullable: true,
	})
	price: number;

	@ManyToOne(() => UsersEntity, users => users.Orders, {
		onDelete: 'SET NULL',
		onUpdate: 'CASCADE',
	})
	@JoinColumn({ name: 'user_id' })
	User: UsersEntity;

	@OneToOne(() => MovieEntity, movie => movie.id)
	@JoinColumn([{ name: 'movie_id', referencedColumnName: 'id' }])
	Movie: MovieEntity;

	static makeQueryBuilder(queryRunner?: QueryRunner) {
		if (queryRunner) {
			return queryRunner.manager.createQueryBuilder(UsersEntity, 'orders');
		} else {
			return this.createQueryBuilder('orders');
		}
	}
}
