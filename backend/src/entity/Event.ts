import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import Channel from "./Channel";
import User from "./User";

@ObjectType()
@Entity("event")
export default class Event extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  start: Date;

  @Field()
  @Column()
  end: Date;

  @Field()
  @Column({ default: "" })
  resource: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => Channel)
  @ManyToOne(() => Channel, { onDelete: "CASCADE" })
  channel: Channel;

  @Field(() => User)
  @ManyToOne(() => User)
  @JoinColumn()
  creator: User;
}
