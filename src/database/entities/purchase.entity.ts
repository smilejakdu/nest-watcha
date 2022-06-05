import {
	BaseEntity,
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	Generated,
	Index,
	ManyToOne,
	OneToOne,
	PrimaryColumn,
	UpdateDateColumn,
} from 'typeorm';

import { BigIntTransformer } from 'src/database/transformer';
import { OrderEntity } from './order.entity';
import { PurchaseVbankEntity } from './purchase_vbank.entity';

export enum PGType {
	IAMPORT = 'iamport',
	SOCIALAPY = 'socialpay',
}

export enum PurchaseStatus {
	INIT = 'init',
	PAID = 'paid',
	CANCELLED = 'cancelled',
	VBANK = 'vbank', // 가상계좌 발급
	DELETED = 'deleted',
}

export enum PurchaseType {
	STANDARD = 'standard',
	EXTRA = 'extra',
}

export enum PurchaseSettlementStatus {
	INIT = 'init', // 미정산
	READY = 'ready', // 정산 예정
	COMPLETE = 'complete', // 정산완료
	RESTORE = 'restore', // 재정산
}

@Entity({ name: 'purchase' })
@Index(['impUid', 'purchaseNumber', 'order'], { unique: true })
export class PurchaseEntity extends BaseEntity {
	@Generated()
	@PrimaryColumn({
		type: 'bigint',
		unsigned: true,
		transformer: BigIntTransformer,
	})
	id: number;

	@Column({
		comment: '결제 번호',
	})
	purchaseNumber: string;

	@Column({
		comment: '아임포트 결제 번호',
		nullable: true,
	})
	impUid: string;

	@Column({
		comment: '총 결제 금액',
		default: 0,
		nullable: true,
	})
	price: number;

	@Column({
		comment: '총 상품 금액',
		default: 0,
		nullable: true,
	})
	optionPrice: number;

	@Column({
		comment: '할인 금액',
		default: 0,
		nullable: true,
	})
	discountPrice: number;

	@Column({
		comment: '배송비 (CampaignShipping의 배송비가 null이면 파트너배송 템플릿에서 배송비 가져옴)',
		default: 0,
		nullable: true,
	})
	shippingFee: number;

	@Column({
		comment: '추가 배송비',
		default: 0,
		nullable: true,
	})
	additionalShippingFee: number;

	@Column({
		comment: '부분환불의 총 합산 금액',
		default: 0,
		nullable: true,
	})
	refund: number;

	@Column({
		type: 'text',
		comment: '결제 영수증 json',
		nullable: true,
	})
	receipt: string;

	@Column({
		default: 'card',
		comment: '결제 수단',
	})
	type: string;

	@Column({
		default: 'kcp',
		comment: 'PG사',
	})
	pgProvider: string;

	@Column({
		type: 'enum',
		enum: PGType,
		default: [PGType.IAMPORT],
		comment: 'PG연동',
	})
	pgType: PGType;

	@Column({
		type: 'enum',
		enum: PurchaseStatus,
		default: [PurchaseStatus.INIT],
		comment: '결제 상태',
	})
	status: PurchaseStatus;

	@Column({
		type: 'enum',
		enum: PurchaseSettlementStatus,
		default: [PurchaseSettlementStatus.INIT],
		comment: '정산 상태',
	})
	settlementStatus: PurchaseSettlementStatus;

	@Column({
		type: 'enum',
		enum: PurchaseType,
		default: [PurchaseType.STANDARD],
		comment: '결제 타입',
	})
	purchaseType: PurchaseType;

	@Column({
		comment: '결제일',
		nullable: true,
	})
	paidAt: Date;

	@Column({
		comment: '취소일',
		nullable: true,
	})
	cancelledAt: Date;

	@Column({
		comment: '결제 실패일',
		nullable: true,
	})
	failedAt: Date;

	@ManyToOne(() => OrderEntity, order => order.id)
	order: OrderEntity;

	@OneToOne(() => PurchaseVbankEntity, vbank => vbank.purchase)
	vbank: PurchaseVbankEntity;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@DeleteDateColumn({
		nullable: true,
	})
	deletedAt: Date;
}
