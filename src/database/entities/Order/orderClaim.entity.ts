import { CoreEntity } from '../core.entity';
import { Column, Entity, JoinColumn, ManyToOne, QueryRunner } from 'typeorm';
import { UsersEntity } from '../User/users.entity';

export enum OrderClaimStatus {
	INIT = 'init', // 기본
	CANCEL_CLAIM = 'cancel_claim', // 취소/반품/교환 철회
	CANCEL_REQUEST = 'cancel_request', // 취소 요청
	CANCEL_SUCCESS = 'cancel_success', // 취소 성공
	RETURN_REQUEST = 'return_request', // 반품 요청
	RETURN_PROGRESS = 'return_progress', // 반품 수거중
	RETURN_PROGRESS_COMPLETE = 'return_progress_complete', // 반품 수거 완료
	RETURN_SUCCESS = 'return_success', // 반품 승인
	RETURN_REJECT = 'return_reject', // 반품 거부
	EXCHANGE_REQUEST = 'exchange_request', // 교환 요청
	EXCHANGE_PROGRESS = 'exchange_progress', // 교환 수거중
	EXCHANGE_PROGRESS_COMPLETE = 'exchange_progress_complete', // 교환 수거 완료
	EXCHANGE_RESHIPPING = 'exchange_reshipping', // 교환 재배송
	EXCHANGE_SUCCESS = 'exchange_success', // 교환 완료
	EXCHANGE_REJECT = 'exchange_reject', // 교환 거부
	EXCHANGE_VBANK = 'exchange_vbank', // 교환 입금 대기중
}

export enum OrderClaimRequestType {
	USER_REQUESTED = 'user_requested', // 사용자 요청
	ADMIN_REQUESTED = 'admin_requested', // 관리자 처리
}

@Entity({ schema: 'nest_watcha', name: 'order_claim' })
export class OrderClaimEntity extends CoreEntity {
	@Column({
		type: 'enum',
		enum: OrderClaimStatus,
		default: OrderClaimStatus.INIT,
		nullable: false,
		comment: '주문 claim 상태',
	})
	order_claim_status: OrderClaimStatus;

	@Column({
		type: 'enum',
		enum: OrderClaimRequestType,
		nullable: false,
		comment: '주문 claim 요청 타입',
	})
	type: OrderClaimRequestType;

	@Column('varchar', { name: 'reason', length: 250, comment: '크레임 사유' })
	reason: string;

	@Column('varchar', {
		name: 'refund_bank_name',
		length: 100,
		comment: '환불 은행명(v bank시 필수)',
	})
	refund_bank_name: string;

	@Column('varchar', {
		name: 'refund_bank_number',
		length: 200,
		comment: '환불 계좌번호(v bank시 필수)',
	})
	refund_bank_number: string;

	@Column('varchar', {
		name: 'refund_bank_code',
		length: 200,
		comment: '환불 은행 코드(v bank시 필수)',
	})
	refund_bank_code: string;

	@Column('varchar', {
		name: 'refund_holder',
		length: 200,
		comment: '환불 계좌 예금주(v bank시 필수)',
	})
	refund_holder: string;

	@Column('int', { name: 'userId', nullable: true })
	userId: number | null;

	@ManyToOne(() => UsersEntity, users => users.OrderClaims)
	@JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
	User: UsersEntity;

	static makeQueryBuilder(queryRunner?: QueryRunner) {
		if (queryRunner) {
			return queryRunner.manager.createQueryBuilder(OrderClaimEntity, 'order_claim');
		} else {
			return this.createQueryBuilder('order_claim');
		}
	}
}
