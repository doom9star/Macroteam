import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import Event from "./Event";
import Message from "./Message";
import Team from "./Team";
import User from "./User";

@ObjectType()
@Entity("channel")
export default class Channel extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field()
  @ManyToOne(() => Team, (t) => t.channels, {
    onDelete: "CASCADE",
  })
  team: Team;

  @Field(() => [String])
  @Column("simple-array")
  owners: string[];

  @Field(() => [User])
  @ManyToMany(() => User)
  @JoinTable({ name: "channel_member" })
  members: User[];

  @Field(() => [Message])
  @OneToMany(() => Message, (m) => m.channel)
  messages: Message[];

  @Field(() => [Event])
  @OneToMany(() => Event, (e) => e.channel)
  events: Event[];
}
