import { Field, ObjectType, registerEnumType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { TeamType } from "../graphql/types";
import Channel from "./Channel";

registerEnumType(TeamType, {
  name: "TeamType",
});

@ObjectType()
@Entity("team")
export default class Team extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ type: "text" })
  description: string;

  @Field(() => TeamType)
  @Column({ type: "enum", enum: TeamType, default: TeamType.PUBLIC })
  type: TeamType;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => [Channel])
  @OneToMany(() => Channel, (c) => c.team)
  channels: Channel[];
}
