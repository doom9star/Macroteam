import { Request, Response } from "express";
import { Field, ObjectType } from "type-graphql";
import Message from "../entity/Message";
import User from "../entity/User";

@ObjectType()
export class CError {
  @Field()
  property: string;

  @Field()
  message: string;
}

@ObjectType()
export class UserResponse {
  @Field({ nullable: true })
  user?: User;

  @Field(() => [CError], { nullable: true })
  errors?: CError[];
}

@ObjectType()
export class StatusResponse {
  @Field()
  status?: boolean;

  @Field(() => [CError], { nullable: true })
  errors?: CError[];
}

export enum TeamType {
  PRIVATE = "PRIVATE",
  PUBLIC = "PUBLIC",
}

export enum SearchType {
  USER = "USER",
  TEAM = "TEAM",
  USER_TEAM = "USER_TEAM",
}

export type TCtx = {
  req: Request & { uid?: string };
  res: Response;
};
