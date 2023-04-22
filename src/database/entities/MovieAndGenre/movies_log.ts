import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";
import {text} from "aws-sdk/clients/customerprofiles";

@Entity({ schema: 'nest_watcha', name: 'movies_log' })
export class MoviesLogEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'user_id', nullable: true })
  user_id: number;

  @Column('text', { name: 'request_data', nullable: true })
  request_data: text;

  @CreateDateColumn()
  createdAt: Date;
}