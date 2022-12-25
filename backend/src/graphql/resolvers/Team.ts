import {
  Arg,
  Args,
  ArgsType,
  Ctx,
  Field,
  FieldResolver,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import Channel from "../../entity/Channel";
import ETeam from "../../entity/Team";
import User from "../../entity/User";
import { isAuth } from "../middleware";
import { CError, TCtx, TeamType } from "../types";

@ArgsType()
class CreateTeamArgs {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => TeamType)
  type: TeamType;

  @Field(() => [String])
  members: string[];
}

@ArgsType()
class EditTeamArgs {
  @Field()
  teamId: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => TeamType)
  type: TeamType;
}

@ObjectType()
class TeamResponse {
  @Field(() => ETeam, { nullable: true })
  team?: ETeam;

  @Field(() => [CError], { nullable: true })
  errors?: CError[];
}

@ObjectType()
class TeamsResponse {
  @Field(() => [ETeam], { nullable: true })
  teams?: ETeam[];

  @Field(() => [CError], { nullable: true })
  errors?: CError[];
}

@Resolver(ETeam)
export default class Team {
  @Query(() => TeamsResponse)
  @UseMiddleware(isAuth)
  async getTeams(@Ctx() { req }: TCtx): Promise<TeamsResponse> {
    const teams = await ETeam.createQueryBuilder("t")
      .leftJoinAndSelect("t.channels", "tc")
      .leftJoin("tc.members", "tm")
      .leftJoinAndSelect("tc.members", "tmm")
      .leftJoinAndSelect("tc.events", "tce")
      .where("tm.id = :id", { id: req.uid })
      .orderBy("t.createdAt", "DESC")
      .addOrderBy("tc.createdAt", "ASC")
      .getMany();

    return { teams };
  }

  @Query(() => TeamResponse)
  @UseMiddleware(isAuth)
  async getTeam(@Arg("id") id: string): Promise<TeamResponse> {
    const team = await ETeam.createQueryBuilder("t")
      .leftJoinAndSelect("t.channels", "tc")
      .leftJoinAndSelect("tc.members", "tcm")
      .leftJoinAndSelect("tc.events", "tce")
      .leftJoinAndSelect("tce.channel", "tcec")
      .where("t.id = :id", { id })
      .orderBy("tc.createdAt", "ASC")
      .addOrderBy("tce.createdAt", "DESC")
      .getOne();
    return { team };
  }

  @Mutation(() => TeamResponse)
  @UseMiddleware(isAuth)
  async createTeam(
    @Args() { name, description, type, members }: CreateTeamArgs,
    @Ctx() { req }: TCtx
  ): Promise<TeamResponse> {
    const creator = await User.findOne(req.uid);

    const team = new ETeam();
    team.name = name;
    team.description = description;
    team.type = type;

    const channel = new Channel();
    channel.name = "General";
    channel.owners = [creator.id];
    channel.members = [creator].concat(await User.findByIds(members));
    await channel.save();

    team.channels = [channel];
    await team.save();

    return { team };
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteTeam(@Arg("id") id: string) {
    await ETeam.delete(id);
    return true;
  }

  @Mutation(() => TeamResponse)
  @UseMiddleware(isAuth)
  async editTeam(
    @Args() { teamId, name, description, type }: EditTeamArgs
  ): Promise<TeamResponse> {
    let team = await ETeam.findOne(teamId);
    team.name = name;
    team.description = description;
    team.type = type;
    team = await team.save();
    return { team };
  }

  @FieldResolver(() => Boolean)
  isOwner(@Root() team: ETeam, @Ctx() { req }: TCtx) {
    return team.channels.some((c) => c.owners.includes(req.uid));
  }
}
