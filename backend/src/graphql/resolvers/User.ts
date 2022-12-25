import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import Team from "../../entity/Team";
import EUser from "../../entity/User";
import { isAuth } from "../middleware";
import { CError, StatusResponse, TCtx, UserResponse } from "../types";

@ObjectType()
export class UsersResponse {
  @Field(() => [EUser], { nullable: true })
  users?: EUser[];

  @Field(() => [CError], { nullable: true })
  errors?: CError[];
}

@InputType()
class EditUserInput {
  @Field()
  name: string;
}

@Resolver(EUser)
export default class User {
  @Query(() => UserResponse)
  @UseMiddleware(isAuth)
  async me(@Ctx() { req }: TCtx): Promise<UserResponse> {
    const user = await EUser.findOne(req.uid);
    if (!user)
      return { errors: [{ property: "user", message: "User doesn't exist!" }] };
    return { user };
  }

  @Mutation(() => StatusResponse)
  @UseMiddleware(isAuth)
  async editUser(
    @Arg("values") values: EditUserInput,
    @Ctx() { req }: TCtx
  ): Promise<StatusResponse> {
    await EUser.update({ id: req.uid }, { ...values });
    return { status: true };
  }
}
