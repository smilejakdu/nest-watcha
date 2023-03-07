import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { CoreEntity } from "../core.entity";
import { CommentsEntity } from "./comments.entity";
import { UsersEntity } from "../User/Users.entity";

@Entity({ schema: 'nest_watcha', name: 'reply' })
export class ReplyEntitiy extends CoreEntity {
  @Column('varchar', { name: 'content', length: 500 })
  content: string;

  @OneToOne(() => CommentsEntity, comments => comments.Reply, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  users: UsersEntity;

  @ManyToOne(() => CommentsEntity, comments => comments.Reply, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'commentId', referencedColumnName: 'id' }])
  comments: CommentsEntity;
}
