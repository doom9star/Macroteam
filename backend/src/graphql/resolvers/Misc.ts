import {
  Arg,
  Ctx,
  Field,
  InputType,
  ObjectType,
  Query,
  registerEnumType,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Like, Not } from "typeorm";
import Team from "../../entity/Team";
import User from "../../entity/User";
import { isAuth } from "../middleware";
import { CError, SearchType, TCtx, TeamType } from "../types";

registerEnumType(SearchType, {
  name: "SearchType",
});

@InputType()
class SearchOptions {
  @Field()
  query: string;

  @Field(() => SearchType)
  type: SearchType;
}

@ObjectType()
class SearchResponse {
  @Field(() => [User], { nullable: true })
  users?: User[];

  @Field(() => [Team], { nullable: true })
  teams?: Team[];

  @Field(() => [CError], { nullable: true })
  errors?: CError[];
}

@Resolver()
export default class Misc {
  @Query(() => SearchResponse)
  @UseMiddleware(isAuth)
  async search(
    @Arg("options") { query, type }: SearchOptions,
    @Ctx() { req }: TCtx
  ): Promise<SearchResponse> {
    if (type === SearchType.USER)
      return {
        users: await User.find({
          where: { name: Like(`%${query}%`), id: Not(req.uid) },
        }),
      };
    else if (type === SearchType.TEAM)
      return {
        teams: await Team.find({
          where: { name: Like(`%${query}%`), type: TeamType.PUBLIC },
        }),
      };
    else if (type === SearchType.USER_TEAM)
      return {
        users: await User.find({
          where: { name: Like(`%${query}%`), id: Not(req.uid) },
        }),

        teams: await Team.find({
          where: { name: Like(`%${query}%`), type: TeamType.PUBLIC },
        }),
      };
    return {};
  }
}
